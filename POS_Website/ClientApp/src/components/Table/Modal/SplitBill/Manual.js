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
const columns = [
  {
    title: "Qty",
    width: 50,
    dataIndex: "name",
    key: "name"
  },
  { title: "Item Name", dataIndex: "age", key: "age" },
  {
    title: "Amount",
    fixed: "right",
    width: 100,
    render: () => <span>123,123</span>
  }
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `${i}`,
    age: 32,
    address: `London Park no. ${i}`
  });
}

const data2 = [];

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
        <div className="body">
          <Row>
            <Col span={11}>
              <div className="manual-left-top">
                <div className="s1">Current Check: 33000610</div>
                <div className="manual-btn s2">
                  <Icon type="user-delete" />
                </div>
                <div className="manual-btn  s3">
                  <Icon type="user-add" />
                </div>
              </div>
              <div className="manual-left-middle">
                <div className="manual-btn active">
                  <Icon type="appstore" theme="filled" />
                </div>
                <div className="manual-btn guest">
                  <span>#1</span>
                </div>
              </div>
              <div className="manual-left-middle2">
                <Table
                  columns={columns}
                  dataSource={data}
                  scroll={{ x: 100, y: 230 }}
                  pagination={false}
                />
              </div>
            </Col>
            <Col span={2}>
              <div className="manual-middle">
                <div className="btn">
                  <Icon type="right" />
                </div>
                <div className="btn">
                  <Icon type="left" />
                </div>
                <div className="btn">
                  <Icon type="home" />
                </div>
              </div>
            </Col>
            <Col span={11}>
              <div className="manual-left-top">
                <div className="s1"></div>
                <div className="manual-btn s2">
                  <Icon type="user-delete" />
                </div>
                <div className="manual-btn  s3">
                  <Icon type="user-add" />
                </div>
              </div>
              <div className="manual-left-middle">
                <div className="manual-btn active">
                  <Icon type="appstore" theme="filled" />
                </div>
                <div className="manual-btn guest">
                  <span>#1</span>
                </div>
              </div>
              <div className="manual-left-middle2">
                <Table
                  columns={columns}
                  dataSource={data2}
                  scroll={{ x: 100, y: 230 }}
                  pagination={false}
                />
              </div>
            </Col>
          </Row>
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
