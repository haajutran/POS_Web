import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/NotiCashier";
import { Icon, Badge } from "antd";

class NotiCashier extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.requestNotiCashier();
  }

  render() {
    const { isLoading, notiCashier } = this.props;
    console.log(notiCashier);
    return (
      <div>
        {!isLoading && (
          <Badge
            // dot={`${notiCashier.length > 0 ? true : false}`}
            className="noti-cashier"
          >
            <Icon
              type="bell"
              // onClick={this.toggle}
            />
          </Badge>
        )}
      </div>
    );
  }
}

export default connect(
  state => state.notiCashier,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NotiCashier);
