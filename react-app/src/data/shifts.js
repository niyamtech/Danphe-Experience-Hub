export const initialShifts = [
  {
    id: 'SFT-1001',
    driver: 'Amelia Clarke',
    trainNo: 'TR-78',
    region: 'East',
    startTime: '2024-07-12T05:00',
    endTime: '2024-07-12T13:00',
    status: 'On Time',
    delayMinutes: 0
  },
  {
    id: 'SFT-1002',
    driver: 'Liam Patel',
    trainNo: 'TR-11',
    region: 'West',
    startTime: '2024-07-12T07:00',
    endTime: '2024-07-12T15:00',
    status: 'Delayed',
    delayMinutes: 24
  },
  {
    id: 'SFT-1003',
    driver: 'Sahana Iyer',
    trainNo: 'TR-45',
    region: 'North',
    startTime: '2024-07-12T09:00',
    endTime: '2024-07-12T17:00',
    status: 'Mechanical Issue',
    delayMinutes: 55
  },
  {
    id: 'SFT-1004',
    driver: 'Oliver West',
    trainNo: 'TR-92',
    region: 'South',
    startTime: '2024-07-12T11:00',
    endTime: '2024-07-12T19:00',
    status: 'Cancelled',
    delayMinutes: 120
  }
];

export const regions = ['East', 'West', 'North', 'South'];
export const statuses = ['On Time', 'Delayed', 'Cancelled', 'Mechanical Issue'];
