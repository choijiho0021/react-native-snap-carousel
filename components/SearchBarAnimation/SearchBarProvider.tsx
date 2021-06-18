//  Created by Artem Bogoslavskiy on 7/5/18.

import React from 'react';
import SearchBarAnimation from './SearchBarAnimation';
import {SearchBarContext} from './SearchBarContext';

export default class SearchBarProvider extends React.Component {
  constructor(props) {
    super(props);

    this.searchBarAnimation = new SearchBarAnimation({
      scrollToOffset: (configScroll) => {
        const tab = configScroll.tab ? configScroll.tab : this.props.currentTab;

        const scrollToOffset = this.handlersScroll[tab];
        if (scrollToOffset)
          scrollToOffset(configScroll.offset, configScroll.animated);
      },
    });

    this.state = {
      canJumpToTab: true,
      contextProvider: {
        animation: this.searchBarAnimation.animationProps,
        addHandlerScroll: this.addHandlerScroll,
        canJumpToTab: this.canJumpToTab,
      },
    };
  }

  componentWillUnmount() {
    this.searchBarAnimation.destroy();
  }

  handlersScroll = {};

  addHandlerScroll = (tab, handler) => {
    this.handlersScroll[tab] = handler;
  };

  canJumpToTab = (canJumpToTab) => this.setState({canJumpToTab});

  render() {
    return (
      <SearchBarContext.Provider value={this.state.contextProvider}>
        {this.props.children(this.searchBarAnimation, {
          canJumpToTab: this.state.canJumpToTab,
        })}
      </SearchBarContext.Provider>
    );
  }
}
