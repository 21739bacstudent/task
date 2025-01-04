
interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
}

const events: Event[] = [
  {
    id: 1,
    title: '',
    start: new Date(2024, 0, 7),
    end: new Date(2024, 0, 7),
  },
 
 
];

export default events;
