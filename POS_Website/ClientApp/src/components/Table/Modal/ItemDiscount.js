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

const { TextArea } = Input;

class ItemDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: "",
      discountValue: "0",
      onTotal: false,
      discountInfoModalVisible: false
    };
  }

  componentDidMount() {
    const { checkNo } = this.props;
  }

  clickKey = key => {
    var { discountValue } = this.state;

    discountValue += key;
    this.setState({
      discountValue
    });
  };

  backspace = () => {
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
    this.setState({
      discountValue: "0"
    });
  };

  dot = () => {
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

  showDiscountInfoModal = type => {
    const { discountValue } = this.state;
    const { item } = this.props;
    if (parseInt(discountValue) === 0) {
      message.error("Please input number!");
      return;
    }
    if (parseInt(discountValue) > item.totalAmount) {
      message.error("Please input discount value lower than total amount!");
      return;
    }
    if (type === "Percent" && parseInt(discountValue) > 100) {
      message.error("Percent cannot be bigger than 100!");
      return;
    }
    this.setState({
      discountInfoModalVisible: true,
      selectedType: type
    });
  };

  cancelDiscountInfoModal = () => {
    this.setState({
      discountInfoModalVisible: false,
      selectedType: ""
    });
  };

  submit = async () => {
    const { discountValue, selectedType } = this.state;
    const { item } = this.props;

    const data = {
      TrnSeq: item.trnSeq,
      DiscountValue: discountValue,
      IsAmount: selectedType === "Amount" ? 1 : 0
    };
    const res = await this.props.itemDiscount(data);
    console.log(res);
    if (res.status === 200) {
      message.success("Success.");
      // this.cancelDiscountInfoModal();
      this.props.onCancel("success");
    }
  };

  render() {
    const {
      discountValue,
      discountInfoModalVisible,
      selectedType
    } = this.state;
    const { item } = this.props;
    console.log(item);
    return (
      <div className="discount">
        <div className="discount-modal-right">
          <div className="dmr-top">
            <div className="input-value">{parseInt(discountValue)}</div>
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
                title="Percent"
                onClick={() => this.showDiscountInfoModal("Percent")}
              >
                <div className="key-content">
                  <Icon type="percentage" />
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
              <div
                className="key success"
                onClick={() => this.showDiscountInfoModal("Amount")}
              >
                <div className="key-content" title="Cash">
                  <Icon type="euro" />
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
        <Modal
          visible={discountInfoModalVisible}
          onCancel={this.cancelDiscountInfoModal}
          onOk={this.submit}
        >
          <div>
            <span>
              DISC
              <b style={{ margin: "0 5px" }}>
                {selectedType === "Percent"
                  ? `${parseInt(discountValue)}%`
                  : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0
                    }).format(parseFloat(discountValue))}
              </b>
              {item.trnDesc}
            </span>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => state.discount,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(ItemDiscount);
