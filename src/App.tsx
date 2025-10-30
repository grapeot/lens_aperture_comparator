import { lazy, Suspense, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getEquivalentLens, lensData } from './lensData';
import { ViewModeToggle } from './components/ViewModeToggle';

const LensSceneCanvas = lazy(() => import('./components/LensSceneCanvas'));

// Generate random HSL color
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 85%, 60%)`;
};

// Standard aperture values (f-stops) - these will be displayed as fixed ticks
const STANDARD_APERTURE_VALUES = [1.4, 2.0, 2.8, 4.0, 5.6, 6.3, 8.0, 11.0];

// Standard focal length values (mm) - these will be displayed as fixed ticks
const STANDARD_FOCAL_LENGTHS = [
  12, 14, 16, 18, 20, 24, 28, 35, 40, 50, 70, 85, 100, 135, 200, 300, 400, 500, 600,
];

// Find the closest standard aperture value to a given value
const findClosestStandardAperture = (value: number): number => {
  return STANDARD_APERTURE_VALUES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
};


function App() {
  const [selectedLensIds, setSelectedLensIds] = useState<Set<string>>(new Set());
  const [isEquivalent, setIsEquivalent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSourceFilter, setDataSourceFilter] = useState<'all' | 'official' | 'ai-research'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [lensColors, setLensColors] = useState<Record<string, string>>(() => {
    const colors: Record<string, string> = {};
    lensData.forEach((lens) => {
      colors[lens.id] = generateRandomColor();
    });
    return colors;
  });

  // Filter lenses based on search and data source
  const filteredLenses = useMemo(() => {
    return lensData.filter((lens) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        lens.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lens.format.toLowerCase().includes(searchQuery.toLowerCase());

      // Data source filter
      const matchesDataSource =
        dataSourceFilter === 'all' || lens.dataSource === dataSourceFilter;

      return matchesSearch && matchesDataSource;
    });
  }, [searchQuery, dataSourceFilter]);

  // Get selected lenses
  const selectedLenses = useMemo(() => {
    const lenses = filteredLenses.filter((lens) => selectedLensIds.has(lens.id));
    if (!isEquivalent) return lenses;
    return lenses.map(getEquivalentLens);
  }, [selectedLensIds, isEquivalent, filteredLenses]);

  // Prepare chart data with markers for original data points (where aperture changes)
  const chartData = useMemo(() => {
    if (selectedLenses.length === 0) return [];

    // Collect all unique focal lengths
    const allFocalLengths = new Set<number>();
    selectedLenses.forEach((lens) => {
      lens.data.forEach((point) => {
        allFocalLengths.add(point.focalLength);
      });
    });

    const sortedFocalLengths = Array.from(allFocalLengths).sort((a, b) => a - b);

    // Track which lenses have original data points at each focal length
    const originalDataPoints = new Map<string, Set<number>>();
    selectedLenses.forEach((lens) => {
      originalDataPoints.set(lens.id, new Set(lens.data.map((p) => p.focalLength)));
    });

    // Create chart data points
    return sortedFocalLengths.map((focalLength) => {
      const dataPoint: any = { focalLength };

      selectedLenses.forEach((lens) => {
        // Find the aperture at this focal length or interpolate
        const lensPoint = lens.data.find((p) => p.focalLength === focalLength);
        if (lensPoint) {
          dataPoint[lens.id] = lensPoint.aperture;
          // Mark this as an original data point (aperture change point)
          if (!dataPoint[`${lens.id}_isOriginal`]) {
            dataPoint[`${lens.id}_isOriginal`] = true;
          }
        } else {
          // Find surrounding points for interpolation
          const before = lens.data.filter((p) => p.focalLength < focalLength).pop();
          const after = lens.data.find((p) => p.focalLength > focalLength);

          if (before && after) {
            // Linear interpolation
            const ratio =
              (focalLength - before.focalLength) / (after.focalLength - before.focalLength);
            dataPoint[lens.id] = before.aperture + ratio * (after.aperture - before.aperture);
          } else if (before) {
            dataPoint[lens.id] = before.aperture;
          } else if (after) {
            dataPoint[lens.id] = after.aperture;
          }
        }
      });

      return dataPoint;
    });
  }, [selectedLenses]);

  // Calculate Y-axis domain and ticks based on selected lenses' aperture range
  const yAxisConfig = useMemo(() => {
    if (selectedLenses.length === 0) {
      return {
        domain: ['auto', 'auto'] as [number | string, number | string],
        ticks: STANDARD_APERTURE_VALUES,
      };
    }

    // Collect all aperture values from selected lenses
    const allApertures: number[] = [];
    selectedLenses.forEach((lens) => {
      lens.data.forEach((point) => {
        allApertures.push(point.aperture);
      });
    });

    if (allApertures.length === 0) {
      return {
        domain: ['auto', 'auto'] as [number | string, number | string],
        ticks: STANDARD_APERTURE_VALUES,
      };
    }

    // Find min and max aperture values
    const minAperture = Math.min(...allApertures);
    const maxAperture = Math.max(...allApertures);

    // Find the closest standard aperture values to min and max
    const closestMinAperture = findClosestStandardAperture(minAperture);
    const closestMaxAperture = findClosestStandardAperture(maxAperture);

    // Find indices of closest standard aperture values
    const minIndex = STANDARD_APERTURE_VALUES.indexOf(closestMinAperture);
    const maxIndex = STANDARD_APERTURE_VALUES.indexOf(closestMaxAperture);

    // Calculate the number of stops based on index difference
    // Each index difference represents approximately 1 stop
    const indexSpan = maxIndex - minIndex;

    let domainMin: number;
    let domainMax: number;
    let displayTicks: number[];

    if (indexSpan < 3) {
      // If span is less than 3 stops, display 4 stops
      const centerIndex = Math.floor((minIndex + maxIndex) / 2);
      const startIndex = Math.max(0, centerIndex - 1);
      const endIndex = Math.min(STANDARD_APERTURE_VALUES.length - 1, centerIndex + 2);
      displayTicks = STANDARD_APERTURE_VALUES.slice(startIndex, endIndex + 1);
      domainMin = displayTicks[0];
      domainMax = displayTicks[displayTicks.length - 1];
    } else {
      // If span is >= 3 stops, display n+1 stops (where n is the index span), add half stop padding on each side
      const numStopsToDisplay = indexSpan + 1;
      
      // Find the range of standard aperture values to display
      // Start from minIndex and extend to show n+1 stops
      const actualMinIndex = Math.max(0, minIndex);
      const actualMaxIndex = Math.min(
        STANDARD_APERTURE_VALUES.length - 1,
        actualMinIndex + numStopsToDisplay - 1
      );
      
      displayTicks = STANDARD_APERTURE_VALUES.slice(actualMinIndex, actualMaxIndex + 1);
      
      // For half-stop padding, we need to calculate values between standard stops
      // Half stop = √(√2) ≈ 1.189
      const halfStopRatio = Math.sqrt(Math.SQRT2);
      
      if (actualMinIndex > 0) {
        // Add half stop below the first tick
        const halfStopBelow = displayTicks[0] / halfStopRatio;
        domainMin = halfStopBelow;
      } else {
        domainMin = displayTicks[0];
      }
      
      if (actualMaxIndex < STANDARD_APERTURE_VALUES.length - 1) {
        // Add half stop above the last tick
        const halfStopAbove = displayTicks[displayTicks.length - 1] * halfStopRatio;
        domainMax = halfStopAbove;
      } else {
        domainMax = displayTicks[displayTicks.length - 1];
      }
    }

    return {
      domain: [domainMax, domainMin] as [number, number], // Reversed: larger aperture (smaller f-value) at top
      ticks: displayTicks.length > 0 ? displayTicks : STANDARD_APERTURE_VALUES,
    };
  }, [selectedLenses]);

  // Calculate X-axis domain and ticks based on selected lenses' focal length range
  const xAxisConfig = useMemo(() => {
    if (selectedLenses.length === 0) {
      return {
        domain: ['auto', 'auto'] as [number | string, number | string],
        ticks: STANDARD_FOCAL_LENGTHS,
      };
    }

    // Collect all focal lengths from selected lenses
    const allFocalLengths: number[] = [];
    selectedLenses.forEach((lens) => {
      lens.data.forEach((point) => {
        allFocalLengths.push(point.focalLength);
      });
    });

    if (allFocalLengths.length === 0) {
      return {
        domain: ['auto', 'auto'] as [number | string, number | string],
        ticks: STANDARD_FOCAL_LENGTHS,
      };
    }

    // Find min and max focal lengths
    const minFocal = Math.min(...allFocalLengths);
    const maxFocal = Math.max(...allFocalLengths);

    // Filter standard focal lengths that fall within the data range
    const validTicks = STANDARD_FOCAL_LENGTHS.filter(
      (focal) => focal >= minFocal * 0.9 && focal <= maxFocal * 1.1
    );

    // If no standard ticks fall within range, use min/max with padding
    const domainMin = validTicks.length > 0 ? Math.min(...validTicks) : Math.max(0, minFocal * 0.98);
    const domainMax = validTicks.length > 0 ? Math.max(...validTicks) : maxFocal * 1.02;

    return {
      domain: [domainMin, domainMax] as [number, number],
      ticks: validTicks.length > 0 ? validTicks : STANDARD_FOCAL_LENGTHS,
    };
  }, [selectedLenses]);

  // Handle lens selection toggle
  const handleSelectionChange = (lensId: string) => {
    setSelectedLensIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lensId)) {
        newSet.delete(lensId);
      } else {
        newSet.add(lensId);
      }
      return newSet;
    });
  };

  // Refresh colors
  const handleRefreshColors = () => {
    const colors: Record<string, string> = {};
    lensData.forEach((lens) => {
      colors[lens.id] = generateRandomColor();
    });
    setLensColors(colors);
  };

  // Toggle all lenses
  const handleToggleAll = () => {
    if (selectedLensIds.size === filteredLenses.length) {
      setSelectedLensIds(new Set());
    } else {
      setSelectedLensIds(new Set(filteredLenses.map((lens) => lens.id)));
    }
  };

  const formatYAxis = (value: number) => `f/${value.toFixed(1)}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-100">镜头光圈比较器</h1>
            <p className="text-sm text-slate-400 mt-1">
              在多个焦段上对比不同镜头的最大光圈表现
            </p>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>
          <div className="text-sm text-slate-400">
            已选择 {selectedLenses.length} 支镜头
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            本项目衍生自{' '}
            <a
              href="https://y-g-jiang.github.io/LAC.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 underline"
            >
              y-g-jiang 的 Lens Aperture Comparator
            </a>
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-slate-800 border-r border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">选择镜头</h2>

          {/* Search box */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索镜头或格式..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Data source filter */}
          <div className="mb-4">
            <label className="text-xs text-slate-400 mb-2 block">数据来源</label>
            <select
              value={dataSourceFilter}
              onChange={(e) =>
                setDataSourceFilter(e.target.value as 'all' | 'official' | 'ai-research')
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部来源</option>
              <option value="official">仅官方规格</option>
              <option value="ai-research">仅 AI 研判</option>
            </select>
          </div>

          {/* Equivalent Focal Length Toggle */}
          <div className="mb-4 flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEquivalent}
                onChange={(e) => setIsEquivalent(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">等效焦距（35mm）</span>
            </label>
          </div>

          {/* Lens list */}
          <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
            {filteredLenses.map((lens) => (
              <label
                key={lens.id}
                className="flex items-start gap-2 p-2 rounded hover:bg-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedLensIds.has(lens.id)}
                  onChange={() => handleSelectionChange(lens.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lensColors[lens.id] }}
                    />
                    <span className="text-sm font-medium">{lens.name}</span>
                    {lens.dataSource === 'ai-research' && (
                      <span
                        className="text-xs px-1.5 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700"
                        title="AI 推理数据，建议与官方资料交叉验证"
                      >
                        AI
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {lens.format === 'full-frame'
                      ? '全画幅'
                      : lens.format === 'apsc'
                        ? 'APS-C'
                        : 'M4/3'}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Stats */}
          <div className="text-xs text-slate-400 mb-4 p-2 bg-slate-700/50 rounded">
            <div>镜头总数：{lensData.length}</div>
            <div>当前筛选：{filteredLenses.length}</div>
            <div>官方规格：{lensData.filter((l) => l.dataSource === 'official').length}</div>
            <div>AI 研判：{lensData.filter((l) => l.dataSource === 'ai-research').length}</div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRefreshColors}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
            >
              随机配色
            </button>
            <button
              onClick={handleToggleAll}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
            >
              {selectedLensIds.size === filteredLenses.length ? '全部取消' : '全部选择'}
            </button>
          </div>
        </aside>

        {/* Chart area */}
        <main className="flex-1 p-6">
          {viewMode === '3d' ? (
            <div className="space-y-4">
              <Suspense
                fallback={
                  <div className="flex h-[520px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-400">
                    正在加载 Three.js 场景…
                  </div>
                }
              >
                <LensSceneCanvas
                  lenses={selectedLenses}
                  selectedLensIds={selectedLensIds}
                  lensColors={lensColors}
                  onToggleLens={handleSelectionChange}
                />
              </Suspense>
              <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">三维视图使用提示</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-400">
                  <li>拖拽旋转，滚轮缩放，右键拖动可平移视角。</li>
                  <li>点击镜头模型可与侧边栏的选择状态保持同步。</li>
                  <li>选择更多镜头即可在场景中展示完整比较。</li>
                </ul>
              </div>
            </div>
          ) : selectedLenses.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-slate-400">
                <p className="text-lg">尚未选择镜头</p>
                <p className="text-sm mt-2">请在左侧勾选至少一个镜头后查看折线图</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-6">
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis
                    dataKey="focalLength"
                    type="number"
                    domain={xAxisConfig.domain}
                    ticks={xAxisConfig.ticks}
                    tickFormatter={(value) => `${value}`}
                    label={{ value: '焦距 (mm)', position: 'insideBottom', offset: -10 }}
                    stroke="#cbd5e1"
                    tick={{ fill: '#cbd5e1' }}
                  />
                  <YAxis
                    type="number"
                    reversed
                    domain={yAxisConfig.domain}
                    scale="log"
                    ticks={yAxisConfig.ticks}
                    tickFormatter={formatYAxis}
                    label={{ value: '最大光圈', angle: -90, position: 'insideLeft' }}
                    stroke="#cbd5e1"
                    tick={{ fill: '#cbd5e1' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '0.5rem',
                    }}
                    labelFormatter={(value) => `${value}mm`}
                    formatter={(value: any) => [`f/${value.toFixed(2)}`, '最大光圈']}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => {
                      const lens = lensData.find((l) => l.id === value);
                      return lens ? lens.name : value;
                    }}
                  />
                  {selectedLenses.map((lens) => (
                    <Line
                      key={lens.id}
                      type="stepAfter"
                      dataKey={lens.id}
                      stroke={lensColors[lens.id]}
                      strokeWidth={2}
                      strokeDasharray={lens.dataSource === 'ai-research' ? '5 5' : undefined}
                      dot={(props: any) => {
                        // Only show dot at original data points (where aperture changes)
                        // In Recharts, props.payload contains the entire data point object
                        const payload = props.payload;
                        const isOriginal = payload && payload[`${lens.id}_isOriginal`];
                        if (isOriginal && props.value !== undefined && props.value !== null) {
                          return (
                            <circle
                              cx={props.cx}
                              cy={props.cy}
                              r={4}
                              fill={lensColors[lens.id]}
                              stroke={lensColors[lens.id]}
                              strokeWidth={2}
                            />
                          ) as React.ReactElement;
                        }
                        return null as any;
                      }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              {/* Legend for data sources */}
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-slate-400"></div>
                  <span>官方规格</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-slate-400 border-dashed" style={{ borderTop: '2px dashed' }}></div>
                  <span>AI 研判（请提前核实）</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
