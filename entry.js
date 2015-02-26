import FluxComponent from 'flummox/component';
import Immutable from 'immutable';
import React from 'react';
import {Actions, Store, Flummox} from 'flummox';

class TodoActions extends Actions {
  deleteTodo(todo) {
    return todo;
  }
}

class TodoStore extends Store {
  constructor(flux) {
    super();

    this.handleDeleteTodo = this.handleDeleteTodo.bind(this);

    let todoActionIds = flux.getActionIds('todos');
    this.register(todoActionIds.deleteTodo, this.handleDeleteTodo);

    this.state = {
      todos: new Immutable.Set([
        'foo',
        'bar',
        'baz',
        'qux'
      ])
    };
  }
  handleDeleteTodo(todo) {
    this.setState({
      todos: this.state.todos.delete(todo)
    });
  }
}

class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('todos', TodoActions);
    this.createStore('todos', TodoStore, this);
  }
}

class Todo extends React.Component {
  constructor() {
    this.onClick = this.onClick.bind(this);
  }
  render() {
    return (
      <li onClick={this.onClick}>{this.props.children}</li>
    );
  }
  onClick() {
    let todoActions = this.props.flux.getActions('todos');
    todoActions.deleteTodo(this.props.children);
  }
}

class Todos extends React.Component {
  render() {
    let todos = this.props.todos.toJS().map((todo, index) =>
      <Todo key={index}>{todo}</Todo>);

    return (
      <ul>
        <FluxComponent>
          {todos}
        </FluxComponent>
      </ul>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={'todos'}>
        <Todos />
      </FluxComponent>
    );
  }
}

let flux = new Flux();
React.render(<App flux={flux} />, document.getElementById('app'));
