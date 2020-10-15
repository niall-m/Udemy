import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from '../App';
import CommentBox from '../CommentBox';

it('shows a comment box', () => {
  const div = document.createElement('div');

  ReactDOM.render(<App />, div);

  expect(div.innerHTML).toContain('Comment Box');

  ReactDOM.unmountComponentAtNode(div);
});

it('shows a comment box', () => {
  const wrapped = shallow(<App />);

  expect(wrapped.find(CommentBox).length).toEqual(1);
});