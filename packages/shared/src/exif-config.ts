export interface ExifConfig {
  label: string
  writable?: boolean
  dunplications?: number[]
  editType?: string
  // descriptor value has been transformed
  valueDescriptor?(value: any): string
  transform?(value: any): any
  detransform?(value: any): any
}

const exifConfig = new Map<number, ExifConfig>([
  [
    33437,
    {
      label: 'Aperture Value',
      valueDescriptor([a, b]: any): string {
        return `f/${a / b}`
      },
    },
  ],
  [
    33434,
    {
      label: 'Exposure Time',
      valueDescriptor([a, b]: any): string {
        return `${a}/${b} sec.`
      },
    },
  ],
  [
    41989,
    {
      label: 'Focal Length',
      valueDescriptor(value: number): string {
        return `${value.toFixed(1)} (35mm film)`
      },
    },
  ],
  [
    37385,
    {
      label: 'Flash',
      valueDescriptor(value: number): string {
        const bit = value.toString(2)
        const b0 = bit.slice(-1)
        const b12 = bit.slice(-3, -1)
        const b34 = bit.slice(-5, -3)
        const b5 = bit.slice(-6, -5)
        const b6 = bit.slice(-7, -6)

        const d0 = ['Flash did not fire', 'Flash fired'][parseInt(b0, 2)]
        const d1 = [
          'No strobe return detection function',
          '',
          'Strobe return light not detected',
          'Strobe return light detected',
        ][parseInt(b12, 2)]
        const d2 = [
          '',
          'Compulsory flash firing',
          'Compulsory flash suppression',
          'Auto mode',
        ][parseInt(b34, 2)]
        const d4 = [
          'No red-eye reduction mode or unknown',
          'Red-eye reduction mode',
        ][parseInt(b6, 2)]

        return [d0, d2, d4].filter(Boolean).join(', ')
      },
    },
  ],
  [
    34867,
    {
      label: 'ISO Speed Rating',
    },
  ],
  [
    271,
    {
      label: 'Factory',
      writable: true,
    },
  ],
  [
    272,
    {
      label: 'Camera Model',
      writable: true,
    },
  ],
  [
    36867,
    {
      label: 'Date/Time',
      writable: true,
      editType: 'datetime-local',
      dunplications: [36868],
      transform(value: string): string {
        const re = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}).+/
        const result = value.match(re)
        if (result) {
          return `${result[1]}-${result[2]}-${result[3]}T${result[4]}:${result[5]}`
        }
        return value
      },
      detransform(value: string): string {
        const re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
        const result = value.match(re)
        if (result) {
          const [_, y, M, d, h, m] = result
          return `${y}:${M}:${d} ${h}:${m}:00`
        }
        return value
      },
    },
  ],
  [
    270,
    {
      label: 'Description',
      writable: true,
    },
  ],
  [
    273,
    {
      label: 'Location',
    },
  ],
  [
    274,
    {
      label: 'Orientation',
      valueDescriptor(value: number): string {
        switch (value) {
          case 1:
            return 'top'
          case 8:
            return 'left'
          case 3:
            return 'bottom'
          case 6:
            return 'right'
          default:
            return ''
        }
      },
      writable: true,
    },
  ],
  [
    305,
    {
      label: 'Software',
      writable: true,
    },
  ],
  [
    315,
    {
      label: 'Author',
    },
  ],
])

export default exifConfig
