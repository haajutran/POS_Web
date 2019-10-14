import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../store/Modal/Discount";
import {
  Icon,
  Badge,
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Select,
  Modal,
  message
} from "antd";
import SplitBillAutomatic from "./SplitBill/Automatic";
import SplitBillAmount from "./SplitBill/Amount";
import SplitBillManual from "./SplitBill/Manual";

const { TextArea } = Input;

class ItemDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSection: 2
    };
  }

  selectSection = section => {
    this.setState({ selectedSection: section });
  };

  handleCancel = status => {
    this.props.onCancel(status);
  };

  render() {
    const { selectedSection } = this.state;
    const { billDetail, checkNo } = this.props;
    console.log(billDetail);
    return (
      <div className="split-bill">
        <div className="sb-actions">
          <div
            className={`sb-action ${selectedSection === 0 ? "active" : ""}`}
            onClick={() => this.selectSection(0)}
          >
            <span>Automatic</span>
          </div>
          <div
            className={`sb-action ${selectedSection === 1 ? "active" : ""}`}
            onClick={() => this.selectSection(1)}
          >
            <span>Amount</span>
          </div>
          <div
            className={`sb-action ${selectedSection === 2 ? "active" : ""}`}
            onClick={() => this.selectSection(2)}
          >
            <span>Manual</span>
          </div>
        </div>

        {selectedSection === 0 ? (
          <SplitBillAutomatic
            checkNo={checkNo}
            handleCancel={this.handleCancel}
          />
        ) : selectedSection === 1 ? (
          <SplitBillAmount
            checkNo={checkNo}
            handleCancel={this.handleCancel}
            totalAmount={billDetail[0].totalAmount}
          />
        ) : (
          <SplitBillManual
            checkNo={checkNo}
            handleCancel={this.handleCancel}
            totalAmount={billDetail[0].totalAmount}
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => state.discount,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(ItemDiscount);
