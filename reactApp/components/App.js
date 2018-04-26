import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

// class component
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  updateTimeslot() {
    return {name: this.refs.name.value, phone: this.refs.phone.value}
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isModalOpen}
               onRequestClose={this.props.closeModal}
               style={Styles.modal} >
          <div style={Styles.container}>
            <h1 style={{color: 'blue'}}>{this.props.modalContent.day} @ {this.props.modalContent.timeSlot}</h1>
            { this.props.modalContent.status === 'available' ? 
              (<h2 style={{color: 'green'}}>Currently available!!!</h2>) : 
              (<h2 style={{color: 'red'}}>You're already booked at this time :(</h2>)
            }
            <h4>Who are you calling?</h4>
            <input type="text"
                   placeholder="John Smith" 
                   defaultValue={this.props.modalContent.contact.name}
                   ref="name" />
            <h4>Phone Number</h4>
            <input type="text"
                   placeholder="(###) ###-####"
                   defaultValue={this.props.modalContent.contact.phone} 
                   ref="phone" />
            <button onClick={() => this.props.closeModal(this.props.modalContent, this.updateTimeslot())} style={{marginTop: 25}}>Update!</button>
          </div>
        </Modal>

        <div style={Styles.container}>
          <h1 style={{textAlign: 'center'}}>Brian's Schedule</h1>
          <div style={{display: "flex", flexDirection: 'row', flex: 1}}>
          {this.props.schedule.map((day, index) => <Day key={day.weekDay} day={day} openModal={this.props.openModal} />)}
          </div>
        </div>
      </div>
    );
  }
};

const Day = ( { day, openModal } ) => {
  return (
    <div style={{display: "flex", flexDirection: 'column', flex: 1, alignItems: 'center'}}>
      <h3>{day.weekDay}</h3>
      {day.schedule.map(hour => (<Hour key={hour.timeSlot} hour={hour} openModal={openModal.bind(this, hour)}/>))}
    </div> 
  )
}

const Hour = ( { hour, openModal } ) => {
  const blockColor = hour.status === 'available' ? Styles.available : Styles.busy;
  return (
    <div style={{...Styles.hour, ...blockColor, ...Styles.container}} onClick={openModal}>
      <text style={{fontSize: 20}}>{hour.timeSlot}</text>
      { 
        hour.status !== 'available' ? <text>{hour.contact.name} @ {hour.contact.phone}</text> : <text style={{textTransform: 'uppercase'}}>{hour.status}</text>
      }
    </div>
    )
}

Hour.propTypes = {
  hour: PropTypes.object,
  openModal: PropTypes.func
}

App.propTypes = {
  schedule: PropTypes.array,
  isModalOpen: PropTypes.bool,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  modalContent: PropTypes.object
}

const Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: '100%'
  },
  hour: {
    borderRadius: 10,
    height: 50,
    width: 130,
    padding: 15,
    margin: 5,
    color: 'white',
    textAlign: 'center'
  },
  available: {
    backgroundColor: 'green'
  },
  busy: {
    backgroundColor: 'red',
  },
  modal: {content:{
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      transform             : 'translate(-50%, -50%)'
    }}
}

 const mapStateToProps = (state) => ({
    schedule: state.schedule,
    isModalOpen: state.isModalOpen,
    modalContent: state.modalContent
 });

 const mapDispatchToProps = (dispatch) => ({
    openModal: (hour) => dispatch({type: 'OPEN_MODAL', timeSlot: hour}),
    closeModal: (current, newInfo) => dispatch({type: 'CLOSE_MODAL', current: current, newInfo: newInfo})
 });

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
