import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../../store/Modal/SplitBill";
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

const { TextArea } = Input;

class SplitBillAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: "0"
    };
  }

  handleSelect = input => {
    const { number } = this.state;
    var num = "";
    if (number === "0") {
      num = input;
    } else {
      num = number + "" + input;
    }
    this.setState({
      number: num
    });
  };

  clear = () => {
    this.setState({
      number: "0"
    });
  };

  minus = () => {
    const { number } = this.state;
    var num = parseInt(number);
    if (num > 2) {
      num--;
    }
    this.setState({
      number: num
    });
  };

  plus = () => {
    const { number } = this.state;
    var num = parseInt(number);
    num++;
    this.setState({
      number: num
    });
  };

  handleDot = () => {
    var { number } = this.state;
    for (var i = 0; i < number.length; i++) {
      if (number[i] === ".") {
        return;
      }
    }
    number += ".";
    this.setState({
      number
    });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  handleOK = async () => {
    const { checkNo } = this.props;
    const { number } = this.state;
    const data = {
      CheckNo: checkNo,
      SliptAmount: number
    };
    const res = await this.props.splitAmount(data);
    console.log(res);
    if (res.status === 200) {
      message.success("Success.");
      this.props.handleCancel("success");
    }
  };

  render() {
    const { number } = this.state;
    const { totalAmount } = this.props;
    // console.log(item);
    return (
      <div>
        <div className="sb-centre">
          <span className="balance">
            Balance:
            <b>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0
              }).format(parseInt(totalAmount))}
            </b>
          </span>
          <div className="sb-input">
            <span>{number}</span>
          </div>
        </div>
        <div className="sb-inputs">
          <div className="sb-btn" onClick={() => this.handleSelect(1)}>
            <span>1</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(2)}>
            <span>2</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(3)}>
            <span>3</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(4)}>
            <span>4</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(5)}>
            <span>5</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(6)}>
            <span>6</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(7)}>
            <span>7</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(8)}>
            <span>8</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(9)}>
            <span>9</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleSelect(0)}>
            <span>0</span>
          </div>
          <div className="sb-btn" onClick={() => this.handleDot()}>
            <span>.</span>
          </div>
          <div className="sb-btn" onClick={() => this.clear()}>
            <Icon type="close-circle" />
          </div>
        </div>
        <div className="footer">
          <Button
            icon="close-circle"
            className="cancel"
            onClick={() => this.handleCancel()}
          >
            Cancel
          </Button>
          <Button
            icon="check-circle"
            className="ok"
            onClick={() => this.handleOK()}
          >
            OK
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => state.splitBill,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(SplitBillAmount);
