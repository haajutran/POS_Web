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
import OrderedTable from "../../OrderedTable";

import * as CurrencyFormat from "react-currency-format";

const { TextArea } = Input;

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
      number: "0",
      guest1Number: 0,
      guestArr: [],
      newCheckNo: "",
      billDetail: [],
      billDetailTmp: [],
      quantity: 0,
      otherModalVisible: false
    };
  }

  async componentDidMount() {
    await this.refreshData();
    this.setState({
      guest1Number: this.props.guestNumber
    });
    var guestArr = [];
    for (var i = 0; i < this.props.guestNumber; i++) {
      guestArr.push(i + 1);
    }
    this.setState({
      guestArr
    });
  }

  componentWillUnmount() {
    const dataNewBill = {
      SelectedGuest: "0",
      CheckNo: "-1",
      SelectedCourse: "0"
    };
    console.log("out");
    this.props.requestNewBillDetail(dataNewBill);
  }

  refreshData = async () => {
    const { newCheckNo } = this.state;
    const { checkNo } = this.props;
    const dataNewBill = {
      SelectedGuest: "0",
      CheckNo: newCheckNo,
      SelectedCourse: "0"
    };
    const dataSplitBill = {
      SelectedGuest: "0",
      CheckNo: checkNo,
      SelectedCourse: "0"
    };
    await this.props.requestNewBillDetail(dataNewBill);
    await this.props.requestSplitBillDetail(dataSplitBill);
  };

  showOtherModal = async () => {
    // const { tableCode, tmpIDOrderedTable } = this.state;

    // const res = await this.props.deleteOrderedTable(tableCode);
    // if (res === 200) {
    this.setState({
      otherModalVisible: true
    });
    // }
  };

  cancelOtherModal = e => {
    this.setState({
      otherModalVisible: false
    });
  };

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
    this.props.handleCancel("");
  };

  addGuest1 = () => {
    const { guest1Number } = this.state;

    this.setState({
      guest1Number: guest1Number + 1
    });
    this.setGuestArr();
  };

  minusGuest1 = () => {
    const { guest1Number } = this.state;

    if (guest1Number === 1) {
      return;
    }
    this.setState({
      guest1Number: guest1Number - 1
    });
    this.setGuestArr();
  };

  setGuestArr = () => {
    const { guest1Number } = this.state;

    var guestArr = [];
    for (var i = 0; i < guest1Number; i++) {
      guestArr.push(i + 1);
    }
    this.setState({
      guestArr
    });
  };

  selectRowLeft = record => {
    this.setState({
      selectedRowLeft: record,
      selectedRowRight: undefined,
      quantity: record.qTy
    });
  };

  selectRowRight = record => {
    this.setState({
      selectedRowLeft: undefined,
      selectedRowRight: record,
      quantity: record.qTy
    });
  };

  createNewCheck = async () => {
    const { checkNo } = this.props;
    const res = await this.props.createNewCheck(checkNo);
    console.log(res);
    if (res.status === 200) {
      if (res.data[0] && res.data[0].resuilt === 0) {
        const newCheckNo = res.data[0].newCheckNo;
        this.setState({ newCheckNo });
      }
    }
  };

  moveToRight = async () => {
    const { selectedRowLeft, quantity, newCheckNo } = this.state;
    const data = {
      QtyTranfer: quantity,
      OrgTrnSeq: selectedRowLeft.trnSeq,
      NewCheckNo: newCheckNo
    };
    const res = await this.props.splitTransfer(data);
    console.log(res);
    if (res.status === 200) {
      this.refreshData();
      // this.props.requestBillDetail();
      this.setState({
        selectedRowLeft: undefined,
        quantity: 0
      });
    }
  };

  moveToLeft = async () => {
    const { selectedRowRight, quantity, newCheckNo } = this.state;
    const { checkNo } = this.props;

    const data = {
      QtyTranfer: quantity,
      OrgTrnSeq: selectedRowRight.trnSeq,
      NewCheckNo: checkNo
    };
    const res = await this.props.splitTransfer(data);
    console.log(res);
    if (res.status === 200) {
      this.refreshData();
      // this.props.requestBillDetail();
      this.setState({
        selectedRowLeft: undefined,
        quantity: 0
      });
    }
  };

  changeQuantity = e => {
    this.setState({
      quantity: e.target.value
    });
  };

  selectOtherTable = async checkNo => {
    this.setState({
      newCheckNo: checkNo,
      otherModalVisible: false
    });
    const dataNewBill = {
      SelectedGuest: "0",
      CheckNo: checkNo,
      SelectedCourse: "0"
    };
    await this.props.requestNewBillDetail(dataNewBill);
  };

  render() {
    const {
      number,
      guest1Number,
      guestArr,
      selectedRowLeft,
      selectedRowRight,
      newCheckNo,
      quantity
    } = this.state;
    console.log(selectedRowLeft);
    console.log(selectedRowRight);
    const { newBillDetail, checkNo, splitBillDetail } = this.props;
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
                <div className="s1">Current Check: {checkNo}</div>
                <div
                  className="manual-btn s2"
                  onClick={() => this.minusGuest1()}
                >
                  <Icon type="user-delete" />
                </div>
                <div
                  className="manual-btn  s3"
                  onClick={() => this.addGuest1()}
                >
                  <Icon type="user-add" />
                </div>
              </div>
              <div className="manual-left-middle">
                <div className="manual-btn active">
                  <Icon type="appstore" theme="filled" />
                </div>
                <div className="guest-zone">
                  {guestArr.length > 0 &&
                    guestArr.map(item => (
                      <div className="manual-btn guest">
                        <span>#{item}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="manual-left-middle2">
                <Table
                  className="bill-detail-table"
                  onRow={record => ({
                    onClick: () => this.selectRowLeft(record)
                    // this.handleChangeQuantity(record)
                  })}
                  rowClassName={(record, index) =>
                    selectedRowLeft
                      ? record.trnSeq === selectedRowLeft.trnSeq
                        ? "selected-row"
                        : ""
                      : ""
                  }
                  dataSource={splitBillDetail}
                  columns={columns}
                  size="default"
                  // scroll={{ y: 340 }}
                  // bordered
                />
              </div>
            </Col>
            <Col span={2}>
              <div className="manual-middle">
                <div className={`btn`} onClick={() => this.createNewCheck()}>
                  New
                </div>

                <div
                  className={`btn ${
                    !selectedRowLeft || newCheckNo === "" ? "disabled" : ""
                  }`}
                  onClick={() => this.moveToRight()}
                >
                  <Icon type="right" />
                </div>

                <div
                  className={`btn ${
                    !selectedRowRight || newCheckNo === "" ? "disabled" : ""
                  }`}
                  onClick={() => this.moveToLeft()}
                >
                  <Icon type="left" />
                </div>

                <div
                  className={`btn quantity ${
                    !selectedRowLeft && !selectedRowRight ? "disabled" : ""
                  }`}
                >
                  {/* <span>{quantity}</span> */}
                  <input value={quantity} onChange={this.changeQuantity} />
                </div>

                <div className={`btn `} onClick={() => this.showOtherModal()}>
                  Other
                </div>
              </div>
            </Col>
            <Col span={11}>
              <div className="manual-left-top">
                <div className="s1">New Check: {newCheckNo}</div>
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
                  className="bill-detail-table"
                  onRow={record => ({
                    onClick: () => this.selectRowRight(record)
                    // this.handleChangeQuantity(record)
                  })}
                  rowClassName={(record, index) =>
                    selectedRowRight
                      ? record.trnSeq === selectedRowRight.trnSeq
                        ? "selected-row"
                        : ""
                      : ""
                  }
                  dataSource={newBillDetail}
                  columns={columns}
                  size="default"
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
        <Modal
          className="join-modal"
          title="Join Tables"
          visible={this.state.otherModalVisible}
          onOk={this.handleOkJoin}
          onCancel={this.cancelOtherModal}
        >
          <OrderedTable
            tableCode={checkNo}
            cancelJoin={this.cancelOtherModal}
            okJoin={this.handleOkJoin}
            selectOtherTable={this.selectOtherTable}
          />
        </Modal>
      </div>
    );
  }
}

const columns = [
  {
    title: "No",
    dataIndex: "o",
    key: "o",
    render: (value, row) => {
      return row.description.trim() === "C.Guide" ? (
        <span className="req" />
      ) : (
        <span
          className={`${row.pToOrder === 1 ? "green" : ""}
        ${row.ptoCheck === 1 ? "red" : ""}`}
        >
          {value}
        </span>
      );
    }
  },
  {
    title: "Item Name",
    dataIndex: "trnDesc",
    key: "trnDesc",
    width: 180,
    render: (value, row) => {
      return row.description.trim() === "C.Guide" ? (
        <span className="req">{value}</span>
      ) : (
        <span
          className={`${row.pToOrder === 1 ? "green" : ""}
        ${row.ptoCheck === 1 ? "red" : ""}`}
        >
          {value}
        </span>
      );
    }
  },
  {
    title: "QTy",
    dataIndex: "trnQTy",
    key: "trnQTy",
    render: (value, row) => {
      return row.description.trim() === "C.Guide" ? (
        <span className="req" />
      ) : (
        <span
          className={`${row.pToOrder === 1 ? "green" : ""}
        ${row.ptoCheck === 1 ? "red" : ""}`}
        >
          {value}
        </span>
      );
    }
  },
  {
    title: "Sub Amount",
    dataIndex: "baseSub",
    key: "baseSub",
    render: (value, row) => {
      return row.description.trim() === "C.Guide" ? (
        <span className="req" />
      ) : (
        <CurrencyFormat
          className={`${row.pToOrder === 1 ? "green" : ""} 
      ${row.ptoCheck === 1 ? "red" : ""}`}
          value={value}
          displayType={"text"}
          thousandSeparator={true}
        />
      );
    }
  },
  {
    title: "Amount",
    dataIndex: "baseTrn",
    key: "baseTrn",
    render: (value, row) => {
      return row.description.trim() === "C.Guide" ? (
        <span className="req" />
      ) : (
        <CurrencyFormat
          className={`${row.pToOrder === 1 ? "green" : ""} 
      ${row.ptoCheck === 1 ? "red" : ""}`}
          value={value}
          displayType={"text"}
          thousandSeparator={true}
        />
      );
    }
  },
  {
    title: "By",
    dataIndex: "cashier",
    key: "cashier",
    render: (value, row) => {
      return row.description.trim() === "C.Guide" ? (
        <span className="req" />
      ) : (
        <span
          className={`${row.pToOrder === 1 ? "green" : ""}
        ${row.ptoCheck === 1 ? "red" : ""}`}
        >
          {value}
        </span>
      );
    }
  }
];

export default connect(
  state => state.splitBill,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(SplitBillAmount);
