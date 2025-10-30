# Lens Aperture Comparator

A comprehensive web-based tool for comparing camera lens aperture characteristics across focal lengths, featuring advanced data visualization, AI-powered research, and transparent data quality management.

## 🌟 Features

### Core Functionality
- **Multi-Lens Comparison**: Compare unlimited lenses simultaneously
- **Interactive 2D Charts**: Step-after curves showing aperture changes across focal lengths
- **Smart Search**: Real-time filtering by lens name or format
- **Data Source Filtering**: Filter by official specs or AI research data
- **Format Conversion**: Equivalent focal length for APS-C and M43 formats

### Data Quality Management
- **Visual Distinction**: Solid lines for official data, dashed lines for AI research
- **AI Badges**: Clear indicators for AI-researched lenses
- **Transparent Sourcing**: Every lens tagged with data source
- **Quality Levels**: Official, Verified, or Estimated data

## 📊 Database: 25 Lenses

**Full Frame** (16 lenses) | **APS-C** (8 lenses) | **M43** (1 lens)

Focal length coverage: 11mm - 600mm | Max zoom ratio: 22.2x

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## 🛠 Technology Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Recharts 3.3

## 📖 How to Use

1. **Select Lenses**: Click checkboxes to select lenses
2. **View Chart**: Chart updates automatically
3. **Search**: Filter by lens name or format
4. **Filter**: Show official or AI-researched data only
5. **Compare**: Observe aperture differences across focal lengths

### Reading the Chart
- **Y-Axis**: Maximum aperture (larger aperture at top)
- **X-Axis**: Focal length in millimeters
- **Solid Lines**: Official specifications
- **Dashed Lines**: AI-researched data

## 📁 Project Structure

```
lens-comparator/
├── src/
│   ├── App.tsx              # Main application
│   ├── lensData.ts          # Lens database (25 lenses)
│   └── index.css            # Styles
├── dist/                    # Production build
├── PROJECT_SUMMARY.md       # Detailed documentation
└── README.md                # This file
```

## 🎯 Use Cases

- **Photographers**: Compare lenses before purchasing
- **Educators**: Teach lens characteristics visually
- **Retailers**: Help customers choose lenses
- **Enthusiasts**: Understand optical design trade-offs

## 🙏 Acknowledgments

Inspired by [y-g-jiang's Lens Aperture Comparator](https://y-g-jiang.github.io/LAC.html)

## 📄 Documentation

See `PROJECT_SUMMARY.md` for comprehensive project documentation including:
- Complete feature list
- Data sources and methodology
- Testing results
- Future enhancement opportunities

---

**Version**: 1.0.0 | **Status**: Production Ready ✅
