import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../store/TableDetail";
import * as TimeServices from "../../services/TimeServices";
import * as CurrencyFormat from "react-currency-format";
import BackspaceIcon from "../../assets/images/backspace-icon.png";

// import { actionCreators } from "../../store/TableDetail";
import {
  Icon,
  Badge,
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Breadcrumb,
  notification,
  message,
  Select,
  Modal
} from "antd";

const { Option } = Select;

// import moment from "moment";
// import * as CurrencyFormat from "react-currency-format";

class TableDetail2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bsMenus: [{}],
      previousMenuNo: "",
      selectedGuest: 0,
      selectedCourse: 0,
      currentMenu: "",
      viewSum: 0,
      quantity: "0",
      cQMVisible: false,
      aRMVisible: false,
      selectedRow: "",
      isOtherRequest: false,
      otherRequest: "",
      classRequests: [],
      itemRequests: [],
      isChoosingRequest: false,
      voidModalVisible: false,
      voidUnsendModalVisible: false,
      selectedVoid: "",
      voidQty: ""
    };
  }

  async componentWillMount() {
    // this.props.requestNotiCashier();
    await this.props.requestMenus(0);
    await this.props.requestCourse();
    await this.props.requestVoidReason();

    const params = this.props.match.params;

    if (params) {
      const { selectedGuest, selectedCourse, viewSum } = this.state;

      const { checkNo } = params;

      await this.props.requestBillDetail(
        checkNo,
        viewSum,
        selectedGuest,
        selectedCourse
      );
      const tableDetail = await this.props.getTableDetail(checkNo);
      const adult = tableDetail.adult;
      const child = tableDetail.child;
      const total = parseInt(adult) + parseInt(child);
      var totalGuests = [];
      for (var i = 1; i <= total; i++) {
        totalGuests.push(i);
      }
      this.setState({
        tableDetail,
        checkNo,
        totalGuests
      });
    }
  }

  async componentWillMount() {
    // this.props.requestNotiCashier();
    await this.props.requestMenus(0);
    await this.props.requestCourse();
    await this.props.requestVoidReason();

    const params = this.props.match.params;

    if (params) {
      const { selectedGuest, selectedCourse, viewSum } = this.state;

      const { checkNo } = params;

      await this.props.requestBillDetail(
        checkNo,
        viewSum,
        selectedGuest,
        selectedCourse
      );
      const tableDetail = await this.props.getTableDetail(checkNo);
      const adult = tableDetail.adult;
      const child = tableDetail.child;
      const total = parseInt(adult) + parseInt(child);
      var totalGuests = [];
      for (var i = 1; i <= total; i++) {
        totalGuests.push(i);
      }
      this.setState({
        tableDetail,
        checkNo,
        totalGuests
      });
    }
  }

  handleClickMenu = async (menuNo, menuName, hasSubMenu) => {
    // console.log(menuNo, menuName);

    const { bsMenus } = this.state;
    this.setState({
      currentMenu: menuNo
    });
    await this.props.requestMenus(menuNo);
    // var bsMenus = [];
    // console.log(menuNo);
    if (menuNo === 0) {
      this.setState({
        bsMenus: []
      });
    } else {
      const isExisted = bsMenus.find(item => item.menuNo === menuNo);
      // console.log(isExisted);
      if (!isExisted) {
        if (hasSubMenu === 1) {
          const menu = {
            menuNo,
            menuName
          };
          // bsMenus.push(menuNo);
          bsMenus.push(menu);
          this.setState({
            bsMenus
          });
        }
      } else {
        var bsMenusTemp = [];
        var i = 0;
        for (var bsm in bsMenus) {
          // console.log(bsMenus[bsm].menuNo);
          const bsMenusClone = bsMenus[bsm];
          const menuNoTemp = bsMenusClone.menuNo;
          const menuNameTemp = bsMenusClone.menuName;
          if (menuNoTemp) {
            console.log(menuName);
            const menu = {
              menuNo: menuNoTemp,
              menuName: menuNameTemp
            };
            // bsMenusTemp.push(bsMenus[bsm]);
            bsMenusTemp.push(menu);
            if (bsMenus[bsm].menuNo === menuNo) {
              break;
            }
          }
        }
        console.log(bsMenusTemp);
        this.setState({
          bsMenus: bsMenusTemp
        });
      }
    }

    // else {

    // }
  };

  handleClickMainMenu = async iCode => {
    const { checkNo, selectedCourse, selectedGuest, quantity } = this.state;
    var setQty = "";
    if (quantity === "0") {
      setQty = 1;
    } else {
      setQty = quantity;
    }
    const data = {
      CheckNo: checkNo,
      ICode: iCode,
      isAddOn: false,
      ChangeOrderNo: 0,
      SelectedCourse: selectedCourse,
      Qty: setQty,
      SelectedGuest: selectedGuest
    };
    const res = await this.props.postItemManual(data);
    if (res === 200) {
      await this.requestBillDetail();
    }
  };

  handleChangeQuantity = () => {
    const { selectedRow } = this.state;
    if (selectedRow === "") {
      notification.open({
        message: "Please select item first!",
        className: "alert-noti"
      });
    } else if (selectedRow.ptoCheck === 0 && selectedRow.pToOrder === 0) {
      this.setState({
        selectedRow: selectedRow,
        cQMVisible: true
      });
    }
  };

  handleVoid = () => {
    const { selectedRow } = this.state;
    if (selectedRow === "") {
      notification.open({
        message: "Please select item first!",
        className: "alert-noti"
      });
    } else if (selectedRow.pToOrder === 1) {
      this.showVoidModal();
    } else if (selectedRow.pToOrder === 0) {
      this.showVoidUnsendModal();
    }
  };

  showVoidModal = () => {
    this.setState({
      voidModalVisible: true
    });
  };

  cancelVoidModal = () => {
    this.setState({
      voidModalVisible: false,
      selectedVoid: "",
      voidQty: ""
    });
  };

  showVoidUnsendModal = () => {
    this.setState({
      voidUnsendModalVisible: true
    });
  };

  cancelVoidUnsendModal = () => {
    this.setState({
      voidUnsendModalVisible: false,
      voidQty: ""
    });
  };

  saveVoid = async () => {
    const { checkNo, selectedRow, voidQty, selectedVoid } = this.state;
    const data = {
      CheckNo: checkNo,
      TrnSeq: selectedRow.trnSeq,
      VoidQty: voidQty ? voidQty : "",
      VoidReason: selectedVoid ? selectedVoid : ""
    };
    console.log(data);
    const res = await this.props.voidItem(data);
    if (res.status === 200) {
      message.success("Void Success");
      this.requestBillDetail();
      this.cancelVoidModal();
      this.cancelVoidUnsendModal();
    }
  };

  handleChangeVoid = value => {
    this.setState({
      selectedVoid: value.key
    });
  };

  handleCancelUpdateQuantity = async e => {
    await this.setState({
      cQMVisible: false
    });
  };

  handleUpdateQuantity = async () => {
    const { selectedRow, checkNo } = this.state;
    if (selectedRow.qTy === "0") {
      notification.open({
        message: "Quantity cannot be lower than 1!",
        className: "alert-noti"
      });
      return;
    }
    const res = await this.props.updateQuantity(
      selectedRow.trnSeq,
      selectedRow.qTy
    );
    if (res === 200) {
      await this.requestBillDetail();
      notification.open({
        message: "Update Successfully!",
        className: "success-noti"
      });
      this.setState({
        cQMVisible: false
      });
    } else {
      notification.open({
        message: "Update Failed!",
        className: "alert-noti"
      });
    }
  };

  handleAddRequest = () => {
    const { selectedRow } = this.state;
    if (selectedRow === "") {
      notification.open({
        message: "Please select item first!",
        className: "alert-noti"
      });
    } else if (selectedRow.ptoCheck === 0 && selectedRow.pToOrder === 0) {
      this.props.requestRequests();
      this.setState({
        // currentCQ: selectedRow,
        aRMVisible: true
      });
    }
  };

  addRequest = async (type, item) => {
    console.log(item);
    var data;
    if (type === 2) {
      data = {
        ICode: item.iCode,
        CGCode: item.idItem,
        CGName: item.cgDescription,
        Orther: false,
        IClass: true,
        Item: false
      };
    } else if (type === 3) {
      data = {
        ICode: item.iCode,
        CGCode: item.idItem,
        CGName: item.cgDescription,
        Orther: false,
        IClass: false,
        Item: true
      };
    }

    const res = await this.props.addRequest(data);
    if (res === 200) {
      this.requestBillDetail();
      notification.open({
        message: "Update Successfully!",
        className: "success-noti"
      });
      this.handleCancelUpdateRequest();
    }
  };

  handleCancelUpdateRequest = async () => {
    await this.setState({
      aRMVisible: false
    });
    this.clearRequests();
  };

  selectGuest = async guest => {
    await this.setState({
      selectedGuest: guest
    });
    await this.requestBillDetail();
  };

  requestBillDetail = async () => {
    const { checkNo, selectedGuest, selectedCourse, viewSum } = this.state;

    await this.props.requestBillDetail(
      checkNo,
      viewSum,
      selectedGuest,
      selectedCourse.id
    );
  };

  selectCourse = async course => {
    console.log(course);
    await this.setState({
      selectedCourse: course
    });
    await this.requestBillDetail();
  };

  sum = async () => {
    await this.setState({
      viewSum: this.state.viewSum === 0 ? 1 : 0,
      selectedCourse: 0
    });
    await this.requestBillDetail();
  };

  clickQuantity = quantity => {
    var plus = "";
    if (this.state.quantity === "0") {
      plus = quantity;
    } else {
      plus = this.state.quantity + "" + quantity;
    }
    this.setState({
      quantity: plus
    });
  };

  clickRemoveQuantity = () => {
    const { quantity } = this.state;
    // console.log(voidQty.length);

    if (quantity.length === 1) {
      this.setState({
        quantity: "0"
      });
    } else if (quantity.length > 1) {
      const minusQuantity = quantity.substring(0, quantity.length - 1);
      this.setState({
        quantity: minusQuantity
      });
    }
  };

  clickVoidQuantity = quantity => {
    var plus = "";
    if (this.state.voidQty === "0") {
      plus = quantity;
    } else {
      plus = this.state.voidQty + "" + quantity;
    }
    const itemQty = this.state.selectedRow.qTy;
    if (parseInt(plus) > parseInt(itemQty)) {
      message.warn("Void Quantity cannot be higher than Item Quantity!");
      return;
    }
    this.setState({
      voidQty: plus
    });
  };

  clickRemoveVoidQuantity = () => {
    const { voidQty } = this.state;
    // console.log(voidQty.length);

    if (voidQty.length === 1) {
      this.setState({
        voidQty: "0"
      });
    } else if (voidQty.length > 1) {
      const minusQuantity = voidQty.substring(0, voidQty.length - 1);
      this.setState({
        voidQty: minusQuantity
      });
    }
  };

  // #region Change Item Quantity
  changeQuantity = quantity => {
    var plus = "";
    var { selectedRow } = this.state;
    const qTy = selectedRow.qTy.toString();
    if (qTy === "0") {
      plus = quantity;
    } else {
      plus = qTy + "" + quantity;
    }
    selectedRow.qTy = plus;
    this.setState({
      selectedRow
    });
  };

  clickRemoveChangeQuantity = () => {
    const { selectedRow } = this.state;
    const quantity = selectedRow.qTy.toString();

    if (quantity.length === 1) {
      selectedRow.qTy = "0";
      this.setState({
        selectedRow
      });
    } else if (quantity.length > 1) {
      const minusQuantity = quantity.substring(0, quantity.length - 1);
      selectedRow.qTy = minusQuantity;
      this.setState({
        selectedRow
      });
    }
  };

  // #endregion

  // #region Change Void Quantity
  changeVoidQuantity = quantity => {
    var plus = "";
    var { voidQty } = this.state;
    const qTy = voidQty.toString();
    if (qTy === "0") {
      plus = quantity;
    } else {
      plus = qTy + "" + quantity;
    }
    voidQty = plus;
    this.setState({
      voidQty
    });
  };

  clickRemoveVoidQuantity = () => {
    var { voidQty } = this.state;
    const quantity = voidQty.toString();

    if (quantity.length === 1) {
      voidQty = "0";
      this.setState({
        voidQty
      });
    } else if (quantity.length > 1) {
      const minusQuantity = quantity.substring(0, quantity.length - 1);
      voidQty = minusQuantity;
      this.setState({
        voidQty
      });
    }
  };

  // #endregion

  sendOrder = async () => {
    const { checkNo } = this.state;
    const sendOrderRes = await this.props.sendOrder(checkNo);
    if (sendOrderRes === 200) {
      await this.requestBillDetail();
    }
  };

  handleSelectRequest = async reqCode => {
    const { selectedRow } = this.state;
    const itemCode = selectedRow.itemCode;
    const trnCode = selectedRow.trnCode;
    if (reqCode === 1) {
      this.setState({
        isOtherRequest: true
      });
    } else if (reqCode === 2) {
      console.log("class");
      const res = await this.props.getClassRequest(itemCode, trnCode);
      if (res.status === 200) {
        const classRequests = res.data;
        this.setState({
          classRequests
        });
      }
    } else if (reqCode === 3) {
      console.log("item");
      const res = await this.props.getItemRequest(itemCode, trnCode);
      if (res.status === 200) {
        const itemRequests = res.data;
        this.setState({
          itemRequests
        });
      }
    }
    this.setState({
      isChoosingRequest: true
    });
  };

  handlePrevBtn = () => {
    this.clearRequests();
  };

  handleUpdateRequest = async () => {
    const { otherRequest, selectedRow } = this.state;

    if (otherRequest.length > 0) {
      const data = {
        ICode: selectedRow.itemCode,
        CGCode: 0,
        CGName: otherRequest,
        Orther: true,
        IClass: false,
        Item: false
      };
      const res = await this.props.addRequest(data);
      if (res === 200) {
        this.requestBillDetail();
        this.handleCancelUpdateRequest();
      }
    }
    this.clearRequests();
  };

  clearRequests = () => {
    this.setState({
      isChoosingRequest: false,
      isOtherRequest: false,
      otherRequest: "",
      itemRequests: [],
      classRequests: []
    });
  };

  handleChangeInputOtherRequest = event => {
    this.setState({
      otherRequest: event.target.value
    });
  };

  selectRow = record => {
    console.log(record);
    this.setState({
      selectedRow: record
    });
  };

  hold = async () => {
    const { checkNo } = this.state;
    const orderHoldRes = await this.props.getOrderHold(checkNo);
    if (orderHoldRes.status === 200) {
      const oHList = orderHoldRes.data;
      console.log(oHList);
      if (oHList && oHList.length > 0) {
        const idHoldMainRes = await this.props.getIDHoldMain();
        if (idHoldMainRes.status === 200) {
          const IDHoldMain = idHoldMainRes.data.getIDHold;
          const CreateTime = idHoldMainRes.data.createTime;
          oHList.map(item => {
            this.props.holdItem(item);
          });
        }
      }
    }
  };

  render() {
    const {
      tableDetail,
      checkNo,
      totalGuests,
      bsMenus,
      selectedGuest,
      selectedCourse,
      currentMenu,
      viewSum,
      quantity,
      // selectedRow,
      selectedRow,
      otherRequest,
      classRequests,
      itemRequests,
      isChoosingRequest,
      isOtherRequest
    } = this.state;
    const {
      menus,
      mainMenus,
      course,
      billDetail,
      requests,
      voidReason
    } = this.props;
    console.log(tableDetail);
    return (
      <Col>
        {tableDetail && (
          <Col className="detail-page">
            <div className="dt2-h">
              <Row>
                <Col xl={18}>
                  <Row>
                    <Col xl={18}>
                      <Row>
                        <Col xl={6}>
                          <b>Open Bill</b>
                        </Col>
                        <Col xl={18}>
                          <span>
                            {tableDetail.openTime} ({tableDetail.mealName})
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={6}>
                      <Row>
                        <Col xl={6}>
                          <b>Table</b>
                        </Col>
                        <Col xl={18}>
                          <span>
                            {tableDetail.tableNo}
                            {tableDetail.subTableNo &&
                              `/${tableDetail.subTableNo}`}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={18}>
                      <Row>
                        <Col xl={6}>
                          <b>Open By</b>
                        </Col>
                        <Col xl={18}>
                          <span>{tableDetail.openBy}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={6}>
                      <Row>
                        <Col xl={6}>
                          <b>Adult</b>
                        </Col>
                        <Col xl={18}>
                          <span>{tableDetail.adult}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={18}>
                      <Row>
                        <Col xl={6}>
                          <b>Client</b>
                        </Col>
                        <Col xl={18}>
                          <span>{tableDetail.clientName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={6}>
                      <Row>
                        <Col xl={6}>
                          <b>Child</b>
                        </Col>
                        <Col xl={18}>
                          <span>{tableDetail.child}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xl={3}>
                  <div className="sz">
                    <div className="checkNo">{checkNo}</div>
                    <div className="time">
                      {TimeServices.getHoursPassed(tableDetail.openTime)} mins
                    </div>
                  </div>
                </Col>
                <Col xl={3}>
                  <Button className="hb-btn">Hide Bill</Button>
                </Col>
              </Row>
              <div className="btnz">
                <div className="ifz-2 non-border">
                  <Icon type="user" />
                  <Button
                    type="primary"
                    onClick={() => this.selectGuest(0)}
                    className={selectedGuest === 0 && "active"}
                  >
                    ALL
                  </Button>
                  {totalGuests.map(g => (
                    <Button
                      className={selectedGuest === g && "active"}
                      onClick={() => this.selectGuest(g)}
                      type="primary"
                    >
                      #{g}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="if-t">
                <Table
                  className="bill-detail-table"
                  onRow={record => ({
                    onClick: () => this.selectRow(record)
                    // this.handleChangeQuantity(record)
                  })}
                  rowClassName={(record, index) =>
                    record.o === selectedRow.o ? "selected-row" : ""
                  }
                  dataSource={billDetail}
                  columns={columns}
                  size="default"
                  // scroll={{ y: 340 }}
                  // bordered
                />
              </div>
            </div>
            <Col className="dt2-actions">
              <div className="btn-sp">
                <Button className="sp-btn">
                  <Icon type="bell" />
                  Recall Order
                </Button>
                <Button className="btn-d">
                  <p>Add/Rmv</p>
                  <p>Tax/Svr</p>
                </Button>
                <Button className="btn-d">Order Message</Button>
                <Button className="btn-d" icon="printer">
                  Print View
                </Button>
              </div>
              <div className="btn-sp">
                <Button className="btn-d" icon="rocket">
                  Send Order
                </Button>
                <Button
                  className="btn-d"
                  icon="retweet"
                  onClick={() => this.handleChangeQuantity()}
                >
                  <span>Change Quantity</span>
                </Button>
                <Button
                  className="btn-d"
                  onClick={() => this.handleAddRequest()}
                >
                  Request
                </Button>
                <Button className="btn-d">Post Quickly</Button>
                <Button className="btn-d" icon="printer">
                  Print
                </Button>
              </div>
              <Col style={{ flexGrow: 8 }}>
                <Col className={`bz bz2`}>
                  <Col>
                    <div className="">
                      <Form
                        onSubmit={this.handleSubmit}
                        className="no-valid-form"
                      >
                        {billDetail && billDetail[0] && (
                          <Row>
                            <div className="row">
                              <Col span={8}>
                                <b>Sub Amount</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalSubAmount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Tax Amount</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalTaxAmount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Discount</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalDiscount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Total Amount</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalAmount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Service Charge</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalServiceCharge}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Total Due</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalDue}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Special Tax</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalSpecialTax}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                            <div className="row">
                              <Col span={8}>
                                <b>Due USD</b>
                              </Col>
                              <Col span={16}>
                                <CurrencyFormat
                                  value={billDetail[0].totalDueUSD}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Col>
                            </div>
                          </Row>
                        )}
                      </Form>
                    </div>
                  </Col>
                </Col>
              </Col>
              <div className="btn-sp">
                <Button className="btn-d" icon="tag">
                  Item Discount
                </Button>
                <Button className="btn-d">
                  <span>Apply Voucher</span>
                </Button>
                <Button className="btn-d">Auto Discount</Button>
                <Button className="btn-d">Client Discount</Button>
                <Button className="btn-d">Order Info</Button>
              </div>
              <div className="btn-sp">
                <Button
                  className="btn-d"
                  icon="close"
                  onClick={() => this.handleVoid()}
                >
                  Void
                </Button>
                <Button className="sp-btn">
                  <Icon type="dollar" />
                  Pay Cash
                </Button>
                <Button className="btn-d" icon="user">
                  Select Client
                </Button>
                <Button className="btn-d">Merge</Button>
              </div>
              <div className="btn-sp">
                <Button className="btn-d" icon="close-circle">
                  Cancel Bill
                </Button>
                <Button className="sp-btn">
                  <Icon type="bell" />
                  Other Pay
                </Button>
                <Button className="btn-d" icon="user-delete">
                  Cancel Client
                </Button>
                <Button className="btn-d">Slipt Bill</Button>
              </div>
              <div className="btn-sp">
                <Button
                  className={`btn-d ${viewSum === 1 && "active"}`}
                  icon="plus-square"
                  onClick={() => this.sum()}
                >
                  Sum Bill
                </Button>
                <Button className="btn-d">
                  <span>Item Voucher</span>
                </Button>
                <Button className="btn-d">Discount</Button>
                <Button className="btn-d">Redeem Point</Button>
                <Button className="btn-d">Share Table</Button>
              </div>
            </Col>
          </Col>
        )}
        <Modal
          title="Change Quantity"
          visible={this.state.cQMVisible}
          onOk={this.handleUpdateQuantity}
          onCancel={this.handleCancelUpdateQuantity}
        >
          <div className="cq-item-info">
            {selectedRow && (
              <div>
                <Row>
                  <div className="cq-line">
                    <Col span={8}>
                      <b>No</b>
                    </Col>
                    <Col span={16}>
                      <span>{selectedRow.o}</span>
                    </Col>
                  </div>
                  <div className="cq-line">
                    <Col span={8}>
                      <b>Item Name</b>
                    </Col>
                    <Col span={16}>
                      <span>{selectedRow.trnDesc}</span>
                    </Col>
                  </div>
                  <div className="cq-line">
                    <Col span={24}>
                      <b>Quantity</b>
                    </Col>
                    <Col span={24}>
                      <div className="quantity-zone">
                        <Input
                          readOnly
                          className="input"
                          value={selectedRow.qTy}
                        />
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("1")}
                        >
                          1
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("2")}
                        >
                          2
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("3")}
                        >
                          3
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("4")}
                        >
                          4
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("5")}
                        >
                          5
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("6")}
                        >
                          6
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("7")}
                        >
                          7
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("8")}
                        >
                          8
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("9")}
                        >
                          9
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.changeQuantity("0")}
                        >
                          0
                        </Button>
                        <Button
                          shape="circle"
                          size={"large"}
                          onClick={() => this.clickRemoveChangeQuantity()}
                        >
                          <img
                            src={BackspaceIcon}
                            style={{
                              width: 25,
                              paddingRight: 2,
                              paddingBottom: 2
                            }}
                          />
                        </Button>
                      </div>
                    </Col>
                  </div>
                </Row>
              </div>
            )}
          </div>
        </Modal>

        <Modal
          title="Add Request"
          visible={this.state.aRMVisible}
          onOk={this.handleUpdateRequest}
          onCancel={this.handleCancelUpdateRequest}
        >
          <div>
            {isChoosingRequest ? (
              <div>
                <div className="prev-btn" onClick={() => this.handlePrevBtn()}>
                  <Button icon="left" type="primary" />
                </div>
                {isOtherRequest && (
                  <div>
                    <h3>Other Request</h3>
                    <Input.TextArea
                      value={otherRequest}
                      onChange={this.handleChangeInputOtherRequest}
                    />
                  </div>
                )}
                {itemRequests && itemRequests.length > 0 && (
                  <div>
                    <h3>Item Request</h3>
                    {itemRequests.map(req => (
                      <Button
                        ghost
                        type="primary"
                        className="request-btn"
                        onClick={() => this.addRequest(3, req)}
                      >
                        {req.cgDescription}
                      </Button>
                    ))}
                  </div>
                )}
                {classRequests && classRequests.length > 0 && (
                  <div>
                    <h3>Class Request</h3>
                    {classRequests.map(req => (
                      <Button
                        ghost
                        type="primary"
                        className="request-btn"
                        onClick={() => this.addRequest(2, req)}
                        // onClick={() => this.handleSelectRequest(req.code)}
                      >
                        {req.cgDescription}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {requests &&
                  requests.map(req => (
                    <Button
                      ghost
                      type="primary"
                      className="request-btn"
                      onClick={() => this.handleSelectRequest(req.code)}
                    >
                      {req.request}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        </Modal>

        <Modal
          title={`Void ${selectedRow.trnDesc}`}
          visible={this.state.voidModalVisible}
          onOk={this.saveVoid}
          onCancel={() => this.cancelVoidModal()}
        >
          {parseInt(selectedRow.qTy) > 1 && (
            <div className="quantity-zone">
              <Input readOnly className="input" value={this.state.voidQty} />
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("1")}
              >
                1
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("2")}
              >
                2
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("3")}
              >
                3
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("4")}
              >
                4
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("5")}
              >
                5
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("6")}
              >
                6
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("7")}
              >
                7
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("8")}
              >
                8
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("9")}
              >
                9
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("0")}
              >
                0
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickRemoveVoidQuantity()}
              >
                <img
                  src={BackspaceIcon}
                  style={{
                    width: 25,
                    paddingRight: 2,
                    paddingBottom: 2
                  }}
                />
              </Button>
            </div>
          )}
          <Select
            placeholder="Select Void"
            style={{ width: "100%" }}
            onChange={this.handleChangeVoid}
            labelInValue
          >
            {voidReason.map(item => (
              <Option value={item.id}>{item.vReason}</Option>
            ))}
            {/* <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option> */}
          </Select>
        </Modal>

        <Modal
          title={`Void ${selectedRow.trnDesc}`}
          visible={this.state.voidUnsendModalVisible}
          onOk={this.saveVoid}
          onCancel={() => this.cancelVoidUnsendModal()}
        >
          Are you sure?
          {parseInt(selectedRow.qTy) > 1 && (
            <div className="quantity-zone">
              <Input readOnly className="input" value={this.state.voidQty} />
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("1")}
              >
                1
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("2")}
              >
                2
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("3")}
              >
                3
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("4")}
              >
                4
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("5")}
              >
                5
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("6")}
              >
                6
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("7")}
              >
                7
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("8")}
              >
                8
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("9")}
              >
                9
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickVoidQuantity("0")}
              >
                0
              </Button>
              <Button
                shape="circle"
                size={"large"}
                onClick={() => this.clickRemoveVoidQuantity()}
              >
                <img
                  src={BackspaceIcon}
                  style={{
                    width: 25,
                    paddingRight: 2,
                    paddingBottom: 2
                  }}
                />
              </Button>
            </div>
          )}
        </Modal>
      </Col>
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
// const DF = Form.create({ name: "df" })(TableDetail);

// export default connect(
//   state => state.tableDetail,
//   dispatch => bindActionCreators(actionCreators, dispatch)
// )(DF);

export default connect(
  state => state.tableDetail,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TableDetail2);
