import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // CSI MasterFormat 2023 Divisions
  const divisions = [
    { code: '00', name: 'Procurement and Contracting Requirements', description: 'Introductory information, bidding requirements, and contracting requirements' },
    { code: '01', name: 'General Requirements', description: 'Administrative and procedural requirements' },
    { code: '02', name: 'Existing Conditions', description: 'Assessment and remediation of existing conditions' },
    { code: '03', name: 'Concrete', description: 'Concrete forming, reinforcing, and placement' },
    { code: '04', name: 'Masonry', description: 'Masonry units, mortar, and accessories' },
    { code: '05', name: 'Metals', description: 'Structural and miscellaneous metal materials' },
    { code: '06', name: 'Wood, Plastics, and Composites', description: 'Rough and finish carpentry, plastic fabrications' },
    { code: '07', name: 'Thermal and Moisture Protection', description: 'Insulation, waterproofing, and roofing' },
    { code: '08', name: 'Openings', description: 'Doors, windows, and glazing' },
    { code: '09', name: 'Finishes', description: 'Plaster, gypsum board, tile, flooring, and painting' },
    { code: '10', name: 'Specialties', description: 'Visual display units, toilet and bath accessories' },
    { code: '11', name: 'Equipment', description: 'Commercial, institutional, and residential equipment' },
    { code: '12', name: 'Furnishings', description: 'Artwork, furniture, and window treatments' },
    { code: '13', name: 'Special Construction', description: 'Integrated construction for special purposes' },
    { code: '14', name: 'Conveying Equipment', description: 'Elevators, escalators, and lifts' },
    { code: '21', name: 'Fire Suppression', description: 'Fire suppression systems and equipment' },
    { code: '22', name: 'Plumbing', description: 'Plumbing fixtures, piping, and equipment' },
    { code: '23', name: 'Heating, Ventilating, and Air Conditioning (HVAC)', description: 'HVAC systems and equipment' },
    { code: '25', name: 'Integrated Automation', description: 'Building automation and control systems' },
    { code: '26', name: 'Electrical', description: 'Electrical distribution, lighting, and communications' },
    { code: '27', name: 'Communications', description: 'Data, voice, and audio-visual systems' },
    { code: '28', name: 'Electronic Safety and Security', description: 'Access control, intrusion detection, and video surveillance' },
    { code: '31', name: 'Earthwork', description: 'Site clearing, excavation, and grading' },
    { code: '32', name: 'Exterior Improvements', description: 'Paving, landscaping, and site development' },
    { code: '33', name: 'Utilities', description: 'Water, sewer, and power distribution systems' },
    { code: '34', name: 'Transportation', description: 'Road and rail transportation systems' },
    { code: '35', name: 'Waterway and Marine Construction', description: 'Marine structures and dredging' },
  ]

  // Create divisions
  for (const division of divisions) {
    await prisma.division.upsert({
      where: { code: division.code },
      update: {},
      create: division,
    })
  }

  console.log('✅ Created divisions')

  // Sample subdivisions for commonly used divisions
  const subdivisions = [
    // Division 03 - Concrete
    { divisionCode: '03', code: '03 10 00', name: 'Concrete Forming and Accessories', description: 'Formwork and accessories for concrete' },
    { divisionCode: '03', code: '03 20 00', name: 'Concrete Reinforcing', description: 'Steel reinforcement for concrete' },
    { divisionCode: '03', code: '03 30 00', name: 'Cast-in-Place Concrete', description: 'Site-mixed and placed concrete' },
    { divisionCode: '03', code: '03 40 00', name: 'Precast Concrete', description: 'Factory-produced concrete elements' },
    { divisionCode: '03', code: '03 50 00', name: 'Cast Decks and Underlayment', description: 'Concrete decking systems' },

    // Division 04 - Masonry
    { divisionCode: '04', code: '04 20 00', name: 'Unit Masonry', description: 'Brick, block, and stone masonry' },
    { divisionCode: '04', code: '04 40 00', name: 'Stone Assemblies', description: 'Natural and manufactured stone' },
    { divisionCode: '04', code: '04 70 00', name: 'Manufactured Masonry', description: 'Simulated masonry products' },

    // Division 05 - Metals
    { divisionCode: '05', code: '05 10 00', name: 'Structural Metal Framing', description: 'Steel framing and supports' },
    { divisionCode: '05', code: '05 20 00', name: 'Metal Joists', description: 'Open-web and steel joists' },
    { divisionCode: '05', code: '05 30 00', name: 'Metal Decking', description: 'Floor and roof decking' },
    { divisionCode: '05', code: '05 50 00', name: 'Metal Fabrications', description: 'Metal stairs, railings, and gratings' },

    // Division 06 - Wood, Plastics, and Composites
    { divisionCode: '06', code: '06 10 00', name: 'Rough Carpentry', description: 'Framing and sheathing' },
    { divisionCode: '06', code: '06 20 00', name: 'Finish Carpentry', description: 'Trim and millwork' },
    { divisionCode: '06', code: '06 40 00', name: 'Architectural Woodwork', description: 'Custom casework and paneling' },

    // Division 07 - Thermal and Moisture Protection
    { divisionCode: '07', code: '07 10 00', name: 'Dampproofing and Waterproofing', description: 'Water protection systems' },
    { divisionCode: '07', code: '07 20 00', name: 'Thermal Protection', description: 'Insulation systems' },
    { divisionCode: '07', code: '07 40 00', name: 'Roofing and Siding Panels', description: 'Exterior panels and roofing' },
    { divisionCode: '07', code: '07 50 00', name: 'Membrane Roofing', description: 'Built-up and single-ply roofing' },
    { divisionCode: '07', code: '07 60 00', name: 'Flashing and Sheet Metal', description: 'Roof and wall flashing' },

    // Division 08 - Openings
    { divisionCode: '08', code: '08 10 00', name: 'Doors and Frames', description: 'Metal and wood doors' },
    { divisionCode: '08', code: '08 30 00', name: 'Specialty Doors and Frames', description: 'Fire-rated and security doors' },
    { divisionCode: '08', code: '08 40 00', name: 'Entrances, Storefronts, and Curtain Walls', description: 'Commercial entrance systems' },
    { divisionCode: '08', code: '08 50 00', name: 'Windows', description: 'Fixed and operable windows' },
    { divisionCode: '08', code: '08 80 00', name: 'Glazing', description: 'Glass and glazing systems' },

    // Division 09 - Finishes
    { divisionCode: '09', code: '09 20 00', name: 'Plaster and Gypsum Board', description: 'Drywall and plaster systems' },
    { divisionCode: '09', code: '09 30 00', name: 'Tiling', description: 'Ceramic, stone, and glass tile' },
    { divisionCode: '09', code: '09 50 00', name: 'Ceilings', description: 'Acoustical and specialty ceilings' },
    { divisionCode: '09', code: '09 60 00', name: 'Flooring', description: 'Carpet, resilient, and wood flooring' },
    { divisionCode: '09', code: '09 90 00', name: 'Painting and Coating', description: 'Interior and exterior finishes' },

    // Division 22 - Plumbing
    { divisionCode: '22', code: '22 10 00', name: 'Plumbing Piping and Pumps', description: 'Water distribution systems' },
    { divisionCode: '22', code: '22 30 00', name: 'Plumbing Equipment', description: 'Water heaters and treatment' },
    { divisionCode: '22', code: '22 40 00', name: 'Plumbing Fixtures', description: 'Sinks, toilets, and fixtures' },

    // Division 23 - HVAC
    { divisionCode: '23', code: '23 10 00', name: 'Facility Fuel Systems', description: 'Gas and oil piping' },
    { divisionCode: '23', code: '23 30 00', name: 'HVAC Air Distribution', description: 'Ductwork and air handling' },
    { divisionCode: '23', code: '23 50 00', name: 'Central Heating Equipment', description: 'Boilers and furnaces' },
    { divisionCode: '23', code: '23 60 00', name: 'Central Cooling Equipment', description: 'Chillers and cooling towers' },
    { divisionCode: '23', code: '23 70 00', name: 'Central HVAC Equipment', description: 'Packaged HVAC units' },

    // Division 26 - Electrical
    { divisionCode: '26', code: '26 10 00', name: 'Medium-Voltage Electrical Distribution', description: 'Primary electrical systems' },
    { divisionCode: '26', code: '26 20 00', name: 'Low-Voltage Electrical Distribution', description: 'Secondary electrical systems' },
    { divisionCode: '26', code: '26 30 00', name: 'Facility Electrical Power Generating and Storing Equipment', description: 'Generators and UPS systems' },
    { divisionCode: '26', code: '26 40 00', name: 'Electrical and Cathodic Protection', description: 'Lightning protection and grounding' },
    { divisionCode: '26', code: '26 50 00', name: 'Lighting', description: 'Interior and exterior lighting' },

    // Division 31 - Earthwork
    { divisionCode: '31', code: '31 10 00', name: 'Site Clearing', description: 'Demolition and site preparation' },
    { divisionCode: '31', code: '31 20 00', name: 'Earth Moving', description: 'Excavation and grading' },
    { divisionCode: '31', code: '31 30 00', name: 'Earthwork Methods', description: 'Soil stabilization and compaction' },

    // Division 32 - Exterior Improvements
    { divisionCode: '32', code: '32 10 00', name: 'Bases, Ballasts, and Paving', description: 'Asphalt and concrete paving' },
    { divisionCode: '32', code: '32 30 00', name: 'Site Improvements', description: 'Fencing, signage, and amenities' },
    { divisionCode: '32', code: '32 90 00', name: 'Planting', description: 'Landscaping and irrigation' },
  ]

  // Create subdivisions
  for (const subdivision of subdivisions) {
    const division = await prisma.division.findUnique({
      where: { code: subdivision.divisionCode },
    })

    if (division) {
      await prisma.subdivision.upsert({
        where: { code: subdivision.code },
        update: {},
        create: {
          divisionId: division.id,
          code: subdivision.code,
          name: subdivision.name,
          description: subdivision.description,
        },
      })
    }
  }

  console.log('✅ Created subdivisions')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
