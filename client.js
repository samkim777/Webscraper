// React code here
import React from 'react';

class client extends React.Component {
    render() {
      return (
        <div className="shopping-list">
          <h1>List of items {this.props.name}</h1>
        </div>
      );
    }
  }