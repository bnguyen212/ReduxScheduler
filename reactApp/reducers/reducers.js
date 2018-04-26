import { combineReducers } from 'redux';

const week = ['Monday', 'Tuesday', "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const typicalDay = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];

const defaultState = week.map(day => (
  {
    weekDay: day,
    schedule: typicalDay.map(time => ({day: day, timeSlot: time, status: 'available', contact: {}}))
  }
))

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CLOSE_MODAL':
      let newState = [...state];
      const dayToUpdate = newState.findIndex(day => (day.weekDay === action.current.day));
      const timeToUpdate = newState[dayToUpdate].schedule.findIndex(time => (time.timeSlot === action.current.timeSlot))
      if (action.newInfo.name && action.newInfo.phone) {
        newState[dayToUpdate].schedule[timeToUpdate].contact = action.newInfo;
        newState[dayToUpdate].schedule[timeToUpdate].status = 'unavailable';
      } else {
        newState[dayToUpdate].schedule[timeToUpdate].contact = {};
        newState[dayToUpdate].schedule[timeToUpdate].status = 'available';
      }
      return newState;
    default:
      return state;
  }
};

const modalReducer = (state = false, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return true;
    case 'CLOSE_MODAL':
      return false;
    default:
      return state;
  }
}

const modalContent = (state = {contact: {}}, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {...action.timeSlot};
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  schedule: reducer,
  isModalOpen: modalReducer,
  modalContent: modalContent
});

export default rootReducer;
