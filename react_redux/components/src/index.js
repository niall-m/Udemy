import React from 'react';
import ReactDOM from 'react-dom';
import CommentDetail from './CommentDetail';
import ApprovalCard from './ApprovalCard';
import faker from 'faker';

const App = () => {
  return (
    <div className="ui container comments">
      <ApprovalCard>
        <CommentDetail 
          author="Sam"
          avatar={faker.image.avatar()}
          timeAgo="Yesterday at 5PM"
          content="Yes."
        />
      </ApprovalCard>

      <ApprovalCard>
        <CommentDetail 
          author="Alexander"
          avatar={faker.image.avatar()}
          timeAgo="Yesterday at 5PM"
          content="No."
        />
      </ApprovalCard>

      <ApprovalCard>
        <CommentDetail 
          author="Jane"
          avatar={faker.image.avatar()}
          timeAgo="Yesterday at 5PM"
          content="Maybe."
        />
      </ApprovalCard>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));