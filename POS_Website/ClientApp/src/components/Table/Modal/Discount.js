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

class Discount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectStaffModalVisible: false,
      selectedClasses: [],
      selectedType: "",
      discountValue: "0",
      selectedDiscount: undefined,
      onTotal: false
    };
  }

  componentDidMount() {
    const { checkNo } = this.props;
    this.props.requestListDiscount(checkNo);
  }

  selectDiscount = async discountItem => {
    this.setState({
      dscCode: discountItem.dscCode,
      discountItem: discountItem
    });
    const selectDiscountRes = await this.props.selectDiscount(
      discountItem.dscCode
    );
    // console.log(selectDiscountRes);
    if (selectDiscountRes.status === 200) {
      if (selectDiscountRes.data[0].requireStaff === 1) {
        this.showSelectStaffModal();
      } else {
        this.setState({
          selectedDiscount: discountItem
        });
        this.requestListClassByBill();
      }
    }
  };

  showSelectStaffModal = () => {
    this.setState({
      selectStaffModalVisible: true
    });
  };

  cancelSelectStaffModal = () => {
    this.setState({
      selectStaffModalVisible: false
    });
  };

  selectStaff = () => {
    const { discountItem } = this.state;
    this.requestListClassByBill();
    this.setState({
      selectedDiscount: discountItem
    });
    this.cancelSelectStaffModal();
  };

  requestListClassByBill = async () => {
    const { checkNo } = this.props;
    const { dscCode } = this.state;

    const data = {
      CheckNo: checkNo,
      DscCode: dscCode,
      OnTotal: false
    };
    await this.props.requestListClassByBill(data);
    this.setState({
      selectedClasses: this.props.listClassByBill
    });
  };

  selectClass = itemClass => {
    const { selectedClasses } = this.state;
    var selectedClassesTemp = [];
    if (selectedClasses.find(sc => sc.clsCode === itemClass.clsCode)) {
      selectedClasses.map(sc => {
        if (sc.clsCode !== itemClass.clsCode) {
          selectedClassesTemp.push(sc);
        }
      });
    } else {
      selectedClassesTemp = selectedClasses;
      selectedClassesTemp.push(itemClass);
    }
    this.setState({
      selectedClasses: selectedClassesTemp
    });
  };

  clickType = type => {
    this.setState({
      selectedType: type,
      discountValue: "0"
    });
  };

  clickKey = key => {
    var { discountValue } = this.state;

    if (this.state.selectedType === "") {
      return;
    }

    discountValue += key;
    this.setState({
      discountValue
    });
  };

  backspace = () => {
    if (this.state.selectedType === "") {
      return;
    }
    const { discountValue } = this.state;
    if (discountValue !== "0") {
      if (discountValue.length === 1) {
        this.setState({
          discountValue: "0"
        });
      } else if (discountValue.length > 1) {
        var value = discountValue.substring(0, discountValue.length - 1);
        this.setState({
          discountValue: value
        });
      }
    }
  };

  clear = () => {
    if (this.state.selectedType === "") {
      return;
    }
    this.setState({
      discountValue: "0"
    });
  };

  dot = () => {
    if (this.state.selectedType === "") {
      return;
    }
    var { discountValue } = this.state;
    if (discountValue[discountValue.length - 1] === ".") {
      return;
    }
    alert(discountValue);
    var temp = discountValue + ".0";
    this.setState({
      discountValue: temp
    });
  };

  submit = async () => {
    const {
      selectedClasses,
      selectedDiscount,
      selectedType,
      discountValue,
      onTotal
    } = this.state;
    if (
      selectedType === "" ||
      discountValue === "0" ||
      selectedClasses.length === 0 ||
      !selectedDiscount
    ) {
      return;
    }
    console.log(selectedClasses);
    const { checkNo } = this.props;
    var selectClassesCode = "[";
    selectedClasses.map((item, i) => {
      selectClassesCode += item.clsCode;
      if (i === selectedClasses.length - 1) {
        selectClassesCode += "]";
      } else {
        selectClassesCode += ",";
      }
    });

    const data = {
      CheckNo: checkNo,
      OnTotal: onTotal,
      DscCode: selectedDiscount.dscCode,
      DscName: selectedDiscount.dscName,
      ListClass: selectClassesCode,
      MyPeriod: this.props.myPeriod,
      Amount: selectedType === "Amount" ? discountValue : "0",
      Rate: selectedType === "Rate" ? discountValue : "0",
      DscStaff: ""
    };
    const discountRes = await this.props.discount(data);
    console.log(discountRes);
    if (discountRes.status === 200) {
      message.success("Discounted.");
      this.props.onCancel("success");
    }
  };

  selectOnTotal = () => {
    this.setState({
      onTotal: !this.state.onTotal
    });
  };

  render() {
    const {
      selectStaffModalVisible,
      selectedClasses,
      selectedType,
      discountValue,
      selectedDiscount,
      onTotal
    } = this.state;
    const { listDiscount, listClassByBill } = this.props;
    console.log(selectedClasses);
    return (
      <div className="discount">
        <Row>
          <Col span={12}>
            <div className="discount-modal-left">
              <div className="list-discount">
                <div className="custom-btn-group">
                  {listDiscount.map((discountItem, i) => (
                    <div
                      key={i}
                      className={`custom-btn ${
                        selectedDiscount === discountItem ? "active" : ""
                      }`}
                      onClick={() => this.selectDiscount(discountItem)}
                    >
                      <span>{discountItem.dscName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="select-class">
                {listClassByBill.map((itemClass, i) => (
                  <div
                    key={i}
                    className={`custom-btn double-line ${selectedClasses.find(
                      sc => sc.clsCode === itemClass.clsCode
                    ) && "active"}`}
                    onClick={() => this.selectClass(itemClass)}
                  >
                    <span>{itemClass.className}</span>
                    <br />
                    <span>{itemClass.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="discount-modal-right">
              <div className="dmr-top">
                <div className="inputs">
                  <div
                    className={`input ${
                      selectedType === "Rate" ? "active" : ""
                    }`}
                    onClick={() => this.clickType("Rate")}
                  >
                    <span className="title">Rate(%)</span>
                    <span className="value">
                      {selectedType === "Rate" &&
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0
                        }).format(parseFloat(discountValue))}
                    </span>
                  </div>
                  <div
                    className={`input ${
                      selectedType === "Amount" ? "active" : ""
                    }`}
                    onClick={() => this.clickType("Amount")}
                  >
                    <span className="title">Amount</span>
                    <span className="value">
                      {selectedType === "Amount" &&
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0
                        }).format(parseInt(discountValue))}
                    </span>
                  </div>
                </div>
                <div
                  className="custom-btn double-line on-btn"
                  onClick={() => this.selectOnTotal()}
                >
                  <span>On</span>
                  <br />
                  <span>{onTotal ? "Total" : "Sub"}</span>
                </div>
              </div>
              <div className="status">
                {selectedDiscount && <span>{selectedDiscount.dscName}: </span>}
              </div>
              <div className="keyboard">
                <div className="line">
                  <div className="key" onClick={() => this.clickKey("1")}>
                    <div className="key-content">1</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("2")}>
                    <div className="key-content">2</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("3")}>
                    <div className="key-content">3</div>
                  </div>
                  <div
                    className="key warning"
                    title="Backspace"
                    onClick={() => this.backspace()}
                  >
                    <div className="key-content">
                      <Icon type="left-circle" />
                    </div>
                  </div>
                </div>

                <div className="line">
                  <div className="key" onClick={() => this.clickKey("4")}>
                    <div className="key-content">4</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("5")}>
                    <div className="key-content">5</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("6")}>
                    <div className="key-content">6</div>
                  </div>
                  <div className="key success" onClick={() => this.submit()}>
                    <div className="key-content" title="Submit">
                      <Icon type="check-circle" />
                    </div>
                  </div>
                </div>
                <div className="line">
                  <div className="key" onClick={() => this.clickKey("7")}>
                    <div className="key-content">7</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("8")}>
                    <div className="key-content">8</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("9")}>
                    <div className="key-content">9</div>
                  </div>
                  <div
                    className="key danger"
                    title="Cancel"
                    onClick={() => this.props.onCancel("default")}
                  >
                    <div className="key-content">
                      <Icon type="stop" />
                    </div>
                  </div>
                </div>
                <div className="line">
                  <div className="key" onClick={() => this.clear()}>
                    <div className="key-content">
                      <Icon type="close-circle" />
                    </div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("0")}>
                    <div className="key-content">0</div>
                  </div>
                  <div className="key" onClick={() => this.dot()}>
                    <div className="key-content">.</div>
                  </div>
                  <div className="key" onClick={() => this.clickKey("000")}>
                    <div className="key-content">000</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div>
          <Modal
            title="Select Staff"
            visible={selectStaffModalVisible}
            onCancel={this.cancelSelectStaffModal}
            onOk={() => this.selectStaff()}
          >
            Hello
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(
  state => state.discount,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Discount);
