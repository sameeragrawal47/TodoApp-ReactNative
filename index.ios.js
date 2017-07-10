import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native';

var Firebase = require('firebase');

class todoApp extends Component{
  constructor(props) {
  super(props);
  var myFirebaseRef = new Firebase('https://todoapp-5f9fb.firebaseio.com');
  this.itemsRef = myFirebaseRef.child('items');
 
  this.state = {
    newTodo: '',
    completed: false,
    todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
  };
  this.handleKey = null;
  this.items = [];
} // End of Constructor

componentDidMount() {
  // When a todo is added
  this.itemsRef.on('child_added', (dataSnapshot) => {
    this.items.push({
       id: dataSnapshot.key(),
       text: dataSnapshot.child("todo").val(), 
       completedTodo: dataSnapshot.child("completedTodo").val()
      });
    this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
  });
 
  // When a todo is removed
  this.itemsRef.on('child_removed', (dataSnapshot) => {
      this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
  });

  // When a todo is changed
  this.itemsRef.on('child_changed', (dataSnapshot) => {
    this.items.forEach(function (value) {
    if(value["id"] == this.handleKey){
      
    this.items.push(dataSnapshot.child("completedTodo").val())
  }

    });
    this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items.slice())
    });
  });
}



addTodo() {
  if (this.state.newTodo !== '') {
    this.itemsRef.push({
      todo: this.state.newTodo,
      completedTodo: this.state.completed,
    });
    this.setState({
      newTodo : ''
    });
  }

console.log(this.items);
}
removeTodo(rowData) {
  this.itemsRef.child(rowData.id).remove();
}

handleCompleted(rowData){
  this.handleKey = rowData.id;
  if(rowData.completedTodo){

    this.itemsRef.child(rowData.id).update({
      completedTodo: false
    })
  }
  if(rowData.completedTodo == false){
    this.itemsRef.child(rowData.id).update({
      completedTodo: true
    })
  }
  
}

renderRow(rowData) {
  return (
      <View>
        <View style={styles.row}>
          <TouchableHighlight
          underlayColor='#dddddd'
          onPress={() => this.removeTodo(rowData)}>
          <Text style={styles.todoText}>{rowData.text}</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#dddddd' onPress={() => this.handleCompleted(rowData)}>
          {rowData.completedTodo? <Text style={styles.todoText}>Completed</Text>:<Text style={styles.todoText}>MarkCompleted</Text>}
          </TouchableHighlight>
        </View>
        <View style={styles.separator} />
      </View>
    
  );
}


render() {
  return (
    <View style={styles.appContainer}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>
          My Todos
        </Text>
      </View>
      <View style={styles.inputcontainer}>
        <TextInput style={styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo}/>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.addTodo()}
          underlayColor='#dddddd'>
          <Text style={styles.btnText}>Add!</Text>
        </TouchableHighlight>
      </View>
      <ListView
        dataSource={this.state.todoSource}
        renderRow={this.renderRow.bind(this)} />
    </View>
  );
}


} // Main Class End

const styles = StyleSheet.create({
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    justifyContent:'space-between',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
    
  }
});

AppRegistry.registerComponent('todoApp', () => todoApp);


