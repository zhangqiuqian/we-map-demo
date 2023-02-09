import chncrs from '@/utils/chncrs'

export function toGCJ02(pt) {
  return chncrs.transform(pt, 'WGS84', 'GCJ02')
}

export function toWGS84(pt) {
  return chncrs.transform(pt, 'GCJ02', 'WGS84')
}
