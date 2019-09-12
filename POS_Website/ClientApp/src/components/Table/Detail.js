import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../store/TableDetail";
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
  Menu,
  Dropdown,
  Modal
} from "antd";
import moment from "moment";
import * as CurrencyFormat from "react-currency-format";
import BackspaceIcon from "../../assets/images/backspace-icon.png";
import * as TimeServices from "../../services/TimeServices";

const { confirm } = Modal;
const { Option } = Select;

class TableDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bsMenus: [{}],
      previousMenuNo: "",
      selectedGuest: 0,
      selectedCourse: 0,
      currentMenu: "",
      viewSum: 0,
      quantity: "1",
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
      voidQty: "",
      addOnVisible: false,
      addOn: [],
      addOnSelected: []
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
      console.log(tableDetail);
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
  postItem = async (iCode, quantity) => {
    const { checkNo, selectedCourse, selectedGuest } = this.state;
    var setQty = "";
    if (quantity === "0") {
      message.warning("Please input quantity!");
      return;
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
    return res;
  };
  handleClickMainMenu = async iCode => {
    const { quantity } = this.state;
    const res = await this.postItem(iCode, quantity);
    if (res === 200) {
      this.setState({
        quantity: "1"
      });
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

  clearVoidQuantity = () => {
    // console.log(voidQty.length);
    this.setState({
      voidQty: ""
    });
  };

  // #endregion

  sendOrder = async () => {
    const { checkNo } = this.state;
    const sendOrderRes = await this.props.sendOrder(checkNo);
    // console.log(sendOrderRes);
    if (sendOrderRes === 200) {
      await this.requestBillDetail();
    }
  };
  clearChangeQuantity = () => {
    this.setState({
      selectedRow: {
        ...this.state.selectedRow,
        qTy: ""
      }
    });
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
    console.log(orderHoldRes);
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

  cancelBill = async () => {
    const that = this;
    const { checkNo } = this.state;
    confirm({
      title: "Are you sure cancel this bill?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        that.props.cancelBill(checkNo);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  hideBill = async () => {
    const that = this;
    const { checkNo, tableDetail } = this.state;
    console.log(this.state);
    const data = {
      checkNo,
      reOpen: 0,
      myOpenID: tableDetail.myOpenID
    };
    confirm({
      title: "Are you sure hide this bill?",
      content: (
        <Button type="danger" onClick={() => that.sendOrderAndHideBill(data)}>
          Send Order & Hide Bill
        </Button>
      ),
      okText: "Hide Bill",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        that.props.hideBill(data);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  sendOrderAndHideBill = async data => {
    const sendOrderRes = await this.props.sendOrder(data.checkNo);
    console.log(sendOrderRes);
    if (sendOrderRes === 200) {
      this.props.hideBill(data);
    }
  };

  addOn = async () => {
    const { selectedRow } = this.state;
    if (selectedRow === "") {
      notification.open({
        message: "Please select item first!",
        className: "alert-noti"
      });
    } else if (selectedRow.ptoCheck === 0 && selectedRow.pToOrder === 0) {
      const data = {
        OrderNo: selectedRow.o,
        TrnSeq: selectedRow.trnSeq,
        ItemCode: selectedRow.itemCode
      };
      const res = await this.props.getAddOn(data);
      if (res.status === 200 && res.data[0].resuilt === 1) {
        message.error(res.data[0].message);
        return;
      }

      this.setState({
        addOnVisible: true,
        addOn: res.data
      });
    }
  };

  cancelVoidModal = () => {
    this.setState({
      addOnVisible: false,
      addOn: []
    });
  };

  submitAddOn = async () => {
    const { addOnSelected, checkNo } = this.state;
    if (addOnSelected.length < 1) {
      message.warn("Please select at least 1 item!");
      return;
    }
    for (let i = 0; i < addOnSelected.length; i++) {
      const res = await this.postItem(addOnSelected[i].iCode, 1);
      console.log(res);
    }
    await this.requestBillDetail();
    this.cancelVoidModal();
  };

  handleClickAddOnItem = item => {
    var { addOnSelected } = this.state;
    if (!addOnSelected.find(i => i.iCode === item.iCode)) {
      addOnSelected.push(item);
    } else {
      var temp = [];
      addOnSelected.map(i => {
        if (i.iCode !== item.iCode) {
          temp.push(i);
        }
      });
      addOnSelected = temp;
    }
    this.setState({
      addOnSelected
    });
  };

  render() {
    // const { isLoading, notiCashier } = this.props;
    // const { getFieldDecorator } = this.props.form;
    // const formItemLayout = {
    //   labelCol: { span: 12 },
    //   wrapperCol: { span: 12 }
    // };
    // const formItemLayout2 = {
    //   labelCol: { span: 10 },
    //   wrapperCol: { span: 14 }
    // };
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
      isOtherRequest,
      addOn
    } = this.state;
    const {
      menus,
      mainMenus,
      course,
      billDetail,
      requests,
      voidReason
    } = this.props;

    const menu = (
      <Menu className="more-options">
        <Menu.Item key="0" onClick={() => this.sum()}>
          <span>Sum</span>
        </Menu.Item>
        <Menu.Divider></Menu.Divider>
        <Menu.Item key="1">
          <span>Recall</span>
        </Menu.Item>
        <Menu.Divider></Menu.Divider>
        <Menu.Item key="3" onClick={() => this.hold()}>
          <span>Hold</span>
        </Menu.Item>
      </Menu>
    );

    // console.log(course);
    // console.log(billDetail);
    return (
      <div className="detail-page">
        {tableDetail && (
          <Row gutter={20}>
            <Col xs={24} md={14} ls={14} xl={10}>
              <div className="info-zone">
                <Row>
                  <Col>
                    <div className="ifz-1">
                      <Row className="line">
                        <Col span={8} className="border-right">
                          <span>Receipt No:</span>
                        </Col>
                        <Col span={8} className="border-right">
                          <span>{checkNo}</span>
                        </Col>
                        <Col span={6}>
                          <span>
                            {TimeServices.getHoursPassed(tableDetail.openTime)}
                          </span>
                        </Col>
                        <Col span={2}>
                          <Dropdown overlay={menu} trigger={["click"]}>
                            <Button
                              // type="primary"
                              shape="circle-outline"
                              ghost
                              icon="more"
                            ></Button>
                          </Dropdown>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col>
                    <div class="oib">
                      <Row gutter={16}>
                        <Col xl={14} className="seperate">
                          <Row>
                            <Col span={10}>
                              <b className="title">Open Bill</b>
                            </Col>
                            <Col span={14}>
                              <span className="value">
                                {moment(new Date(tableDetail.openTime)).format(
                                  "DD/MM/YYYY HH:MM"
                                )}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={10} className="seperate">
                          <Row>
                            <Col span={10}>
                              <b className="title">Table</b>
                            </Col>
                            <Col span={14}>
                              <span className="value">
                                {tableDetail.tableNo}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={14} className="seperate">
                          <Row>
                            <Col span={10}>
                              <b className="title">Open By</b>
                            </Col>
                            <Col span={14}>
                              <span className="value">
                                {tableDetail.openBy}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={10} className="seperate">
                          <Row>
                            <Col span={10}>
                              <b className="title">Adult</b>
                            </Col>
                            <Col span={14}>
                              <span className="value">{tableDetail.adult}</span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={14} className="seperate">
                          <Row>
                            <Col span={10}>
                              <b className="title">Client</b>
                            </Col>
                            <Col span={14}>
                              <span className="value">
                                {tableDetail.clientName}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={10} className="seperate">
                          <Row>
                            <Col span={10}>
                              <b className="title">Child</b>
                            </Col>
                            <Col span={14}>
                              <span className="value">{tableDetail.child}</span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col>
                    <div className="ifz-2">
                      <Icon type="user" />
                      <Button
                        type="primary"
                        onClick={() => this.selectGuest(0)}
                        className={`btn-all ${selectedGuest === 0 && "active"}`}
                      >
                        ALL
                      </Button>
                      {totalGuests.map(g => (
                        <Button
                          className={`btn1 ${selectedGuest === g && "active"}`}
                          onClick={() => this.selectGuest(g)}
                          type="primary"
                        >
                          #{g}
                        </Button>
                      ))}
                    </div>
                  </Col>
                  <Col className={` ${viewSum === 1 ? `close` : ``}`}>
                    <div className="ifz-2">
                      <Icon type="book" />
                      <Button
                        type="primary"
                        onClick={() => this.selectCourse(0)}
                        className={`btn-all ${selectedCourse === 0 &&
                          "active"}`}
                      >
                        ALL
                      </Button>
                      {course.map(c => (
                        <Button
                          onClick={() => this.selectCourse(c)}
                          className={`btn2 ${selectedCourse === c && "active"}`}
                          type="primary"
                        >
                          {c.courseName}
                        </Button>
                      ))}
                    </div>
                  </Col>
                  <Col>
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
                  </Col>
                  <Col>
                    <div className="ifz-3"></div>
                  </Col>
                  {/* <div className={`bz ${viewSum === 1 ? `close` : ``}`}>
                    <Col style={{ marginTop: "1em" }}>
                      <div className="nvf">
                        <Form
                          onSubmit={this.handleSubmit}
                          className="no-valid-form"
                        >
                          {billDetail && billDetail[0] && (
                            <Row gutter={16}>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Sub Amount</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalSubAmount}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Tax Amount</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalTaxAmount}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Discount</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalDiscount}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Total Amount</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalAmount}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Service Charge</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalServiceCharge}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Total Due</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalDue}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Special Tax</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalSpecialTax}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={12}>
                                <Row>
                                  <Col span={12}>
                                    <b>Due USD</b>
                                  </Col>
                                  <Col span={12}>
                                    <CurrencyFormat
                                      value={billDetail[0].totalDueUSD}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </Form>
                      </div>
                    </Col>
                  </div> */}
                </Row>
              </div>
            </Col>
            <Col xs={24} xl={14}>
              <div className="order-zone">
                <Row>
                  <Col>
                    {/* <div className="oib">
                      <Row gutter={16}>
                        <Col xl={20}>
                          <Row gutter={16}>
                            <Col xl={14} className="seperate">
                              <Row>
                                <Col span={10}>
                                  <b className="title">Open Bill</b>
                                </Col>
                                <Col span={14}>
                                  <span className="value">
                                    {moment(
                                      new Date(tableDetail.openTime)
                                    ).format("DD/MM/YYYY HH:MM")}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={10} className="seperate">
                              <Row>
                                <Col span={10}>
                                  <b className="title">Table</b>
                                </Col>
                                <Col span={14}>
                                  <span className="value">
                                    {tableDetail.tableNo}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={14} className="seperate">
                              <Row>
                                <Col span={10}>
                                  <b className="title">Open By</b>
                                </Col>
                                <Col span={14}>
                                  <span className="value">
                                    {tableDetail.openBy}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={10} className="seperate">
                              <Row>
                                <Col span={10}>
                                  <b className="title">Adult</b>
                                </Col>
                                <Col span={14}>
                                  <span className="value">
                                    {tableDetail.adult}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={14} className="seperate">
                              <Row>
                                <Col span={10}>
                                  <b className="title">Client</b>
                                </Col>
                                <Col span={14}>
                                  <span className="value">
                                    {tableDetail.clientName}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={10} className="seperate">
                              <Row>
                                <Col span={10}>
                                  <b className="title">Child</b>
                                </Col>
                                <Col span={14}>
                                  <span className="value">
                                    {tableDetail.child}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={4} className="hd-btn">
                          <Button
                            className="hb-btn"
                            title="Hide Bill"
                            icon="check"
                          />
                        </Col>
                      </Row>
                    </div> */}
                  </Col>
                  <Col>
                    <div className="oz">
                      <div className="menus-zone">
                        <div className="mz-wrap">
                          {menus.map(menu => (
                            <div
                              className={`order-item-custom ${currentMenu ===
                                menu.menuNo && "active"}`}
                              onClick={() =>
                                this.handleClickMenu(
                                  menu.menuNo,
                                  menu.menuName,
                                  menu.hasSubMenu
                                )
                              }
                            >
                              <div className="oi-wrap">
                                <div className="oi-img">
                                  <img
                                    className="image"
                                    src={`data:image/png;base64, ${menu.image}`}
                                  />
                                </div>

                                <div className="oi-text">
                                  <p>{menu.menuName}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="breadscrumb-menu">
                        <Breadcrumb>
                          <Breadcrumb.Item
                            onClick={() => this.handleClickMenu(0, "", "")}
                          >
                            <Icon type="home" />
                          </Breadcrumb.Item>

                          {bsMenus.map(bsm => (
                            <Breadcrumb.Item
                              onClick={() =>
                                this.handleClickMenu(bsm.menuNo, "", "")
                              }
                            >
                              {bsm.menuName}
                            </Breadcrumb.Item>
                          ))}
                        </Breadcrumb>
                      </div>
                      <div className="item-zone">
                        {mainMenus && mainMenus.length > 0 && (
                          <div className="quantity-zone">
                            <Input
                              readOnly
                              className="input"
                              value={quantity}
                            />
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("1")}
                            >
                              1
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("2")}
                            >
                              2
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("3")}
                            >
                              3
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("4")}
                            >
                              4
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("5")}
                            >
                              5
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("6")}
                            >
                              6
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("7")}
                            >
                              7
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("8")}
                            >
                              8
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("9")}
                            >
                              9
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickQuantity("0")}
                            >
                              0
                            </Button>
                            <Button
                              shape="circle"
                              size={"large"}
                              onClick={() => this.clickRemoveQuantity()}
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
                        {mainMenus.map(mainMenu => (
                          <div
                            className="order-item main-item "
                            onClick={() =>
                              this.handleClickMainMenu(mainMenu.iCode)
                            }
                          >
                            <div className="oi-text">
                              <p>{mainMenu.iName}</p>
                            </div>
                            <div className="p-text">
                              <p>
                                <CurrencyFormat
                                  value={mainMenu.price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                                <span className="symbol">
                                  {mainMenu.crSymbol}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        )}
        <div className="table-actions">
          <div className="ab">
            {billDetail && billDetail[0] && (
              <div className="order-info-group">
                <div className="order-info">
                  <div className="order-item-info">
                    <div className="title">Sub Amount: </div>
                    <div>
                      <CurrencyFormat
                        value={billDetail[0].totalSubAmount}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div className="title">Discount: </div>
                    <div>
                      <CurrencyFormat
                        value={billDetail[0].totalDiscount}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div className="title">Service Charge: </div>
                    <div>
                      <CurrencyFormat
                        value={billDetail[0].totalServiceCharge}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="order-info sl">
                  <div className="order-item-info">
                    <div className="title">Special Tax: </div>
                    <div>
                      <CurrencyFormat
                        value={billDetail[0].totalSpecialTax}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div className="title">Tax Amount: </div>
                    <div>
                      <CurrencyFormat
                        value={billDetail[0].totalTaxAmount}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                  <div className="order-item-info total-amount">
                    <div className="title ">Total Amount: </div>
                    <div>
                      <CurrencyFormat
                        value={billDetail[0].totalAmount}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`ab-item sl`} onClick={() => this.cancelBill()}>
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="close" />
                </div>

                <div className="ab-text">
                  <p>Cancel Bill</p>
                </div>
              </div>
            </div>

            <div className={`ab-item`} onClick={() => this.handleAddRequest()}>
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="deployment-unit" />
                </div>

                <div className="ab-text">
                  <p>Request</p>
                </div>
              </div>
            </div>
            <div className={`ab-item`} onClick={() => this.handleVoid()}>
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="stop" />
                </div>

                <div className="ab-text">
                  <p>Void</p>
                </div>
              </div>
            </div>
            <div className={`ab-item`} onClick={() => this.addOn()}>
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="appstore" />
                </div>

                <div className="ab-text">
                  <p>Add On</p>
                </div>
              </div>
            </div>
            <div
              className={`ab-item`}
              onClick={() => this.handleChangeQuantity()}
            >
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="swap" />
                </div>

                <div className="ab-text">
                  <p>Change Qty</p>
                </div>
              </div>
            </div>
            <div
              className={`ab-item`}
              onClick={() =>
                window.location.replace(`/tableDetail2/${checkNo}`)
              }
            >
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="bars" />
                </div>

                <div
                  className="ab-text"
                  // onClick={}
                >
                  <p>Other Options</p>
                </div>
              </div>
            </div>
            <div className={`ab-item sl`} onClick={() => this.sendOrder()}>
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="select" />
                </div>

                <div className="ab-text">
                  <p>Send Order</p>
                </div>
              </div>
            </div>

            <div className={`ab-item`} onClick={() => this.hideBill()}>
              <div className="ab-wrap">
                <div className="ab-icon">
                  <Icon type="check" />
                </div>

                <div className="ab-text">
                  <p>Hide Bill</p>
                </div>
              </div>
            </div>

            {/* <Row>
                        <Col xl={16}>
                          <Button icon="close" ghost>
                            Cancel Bill
                          </Button>
                          <Button icon="search" ghost>
                            Ord Quickly
                          </Button>
                          <Button icon="menu" ghost>
                            Top Menu
                          </Button>
                          <Button
                            icon="deployment-unit"
                            ghost
                            onClick={() => this.handleAddRequest()}
                          >
                            Request
                          </Button>
                          <Button icon="stop" ghost>
                            Void
                          </Button>
                          <Button icon="appstore" ghost>
                            Add On
                          </Button>
                          <Button
                            icon="swap"
                            ghost
                            onClick={() => this.handleChangeQuantity()}
                          >
                            Change Qty
                          </Button>
                          <Button icon="bars" ghost>
                            Other Options
                          </Button>
                        </Col>
                        <Col xl={6}>
                          <Button
                            icon="select"
                            ghost
                            style={{ height: 130 }}
                            onClick={() => this.sendOrder()}
                          >
                            Send Order
                          </Button>
                        </Col>
                      </Row> */}
          </div>
        </div>
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
                      <div>
                        <Input
                          prefix={
                            <Icon
                              type="calculator"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          value={selectedRow.qTy}
                          style={{ marginBottom: 20, marginTop: 20 }}
                          placeholder="Quantity"
                        />

                        <div className="keys-input ki-2">
                          <div className="row">
                            <div
                              className={`btn`}
                              onClick={() => this.changeQuantity(7)}
                            >
                              7
                            </div>
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(8)}
                            >
                              8
                            </div>
                            <div
                              className={`btn`}
                              onClick={() => this.changeQuantity(9)}
                            >
                              9
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className={`btn`}
                              onClick={() => this.changeQuantity(4)}
                            >
                              4
                            </div>
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(5)}
                            >
                              5
                            </div>
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(6)}
                            >
                              6
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(1)}
                            >
                              1
                            </div>
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(2)}
                            >
                              2
                            </div>
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(3)}
                            >
                              3
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className={`btn`}
                              onClick={() => this.clearChangeQuantity()}
                            >
                              Clear
                            </div>
                            <div
                              className={`btn `}
                              onClick={() => this.changeQuantity(0)}
                            >
                              0
                            </div>
                            <div
                              className={`btn`}
                              onClick={() => this.changeQuantity(".")}
                            >
                              .
                            </div>
                          </div>
                        </div>
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
          <Select
            placeholder="Select Void"
            style={{ width: "100%", marginBottom: 20 }}
            onChange={this.handleChangeVoid}
            labelInValue
          >
            {voidReason.map(item => (
              <Option value={item.id}>{item.vReason}</Option>
            ))}
          </Select>
          {parseInt(selectedRow.qTy) > 1 && (
            <div>
              <Input
                prefix={
                  <Icon
                    type="calculator"
                    style={{ color: "rgba(0,0,0,.25)" }}
                  />
                }
                value={this.state.voidQty}
                style={{ marginBottom: 20 }}
                placeholder="Quantity"
              />

              <div className="keys-input ki-2">
                <div className="row">
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(7)}
                  >
                    7
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(8)}
                  >
                    8
                  </div>
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(9)}
                  >
                    9
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(4)}
                  >
                    4
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(5)}
                  >
                    5
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(6)}
                  >
                    6
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(1)}
                  >
                    1
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(2)}
                  >
                    2
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(3)}
                  >
                    3
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`btn`}
                    onClick={() => this.clearVoidQuantity()}
                  >
                    Clear
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(0)}
                  >
                    0
                  </div>
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(".")}
                  >
                    .
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title={`Void ${selectedRow.trnDesc}`}
          visible={this.state.voidUnsendModalVisible}
          onOk={this.saveVoid}
          onCancel={() => this.cancelVoidUnsendModal()}
        >
          {parseInt(selectedRow.qTy) > 1 && (
            <div>
              <Input
                prefix={
                  <Icon
                    type="calculator"
                    style={{ color: "rgba(0,0,0,.25)" }}
                  />
                }
                value={this.state.voidQty}
                style={{ marginBottom: 20 }}
                placeholder="Quantity"
              />

              <div className="keys-input ki-2">
                <div className="row">
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(7)}
                  >
                    7
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(8)}
                  >
                    8
                  </div>
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(9)}
                  >
                    9
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(4)}
                  >
                    4
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(5)}
                  >
                    5
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(6)}
                  >
                    6
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(1)}
                  >
                    1
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(2)}
                  >
                    2
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(3)}
                  >
                    3
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`btn`}
                    onClick={() => this.clearVoidQuantity()}
                  >
                    Clear
                  </div>
                  <div
                    className={`btn `}
                    onClick={() => this.clickVoidQuantity(0)}
                  >
                    0
                  </div>
                  <div
                    className={`btn`}
                    onClick={() => this.clickVoidQuantity(".")}
                  >
                    .
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title={`Add On ${selectedRow.trnDesc}`}
          visible={this.state.addOnVisible}
          onOk={this.submitAddOn}
          onCancel={() => this.cancelVoidModal()}
          className="addon-modal"
        >
          <div>
            {addOn.map(item => (
              <div
                className={`addon-btn ${this.state.addOnSelected.find(
                  i => i.iCode === item.iCode
                ) && "active"}`}
                onClick={() => this.handleClickAddOnItem(item)}
              >
                <span>{item.iName}</span>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    );
  }
}

// const renderContent = (value, row, index) => {
//   return row.description.trim() === "C.Guide" ? (
//     <span className="req">{123}</span>
//   ) : (
//     <span
//       className={`${row.pToOrder === 1 ? "green" : ""}
//     ${row.ptoCheck === 1 ? "red" : ""}`}
//     >
//       {value}
//     </span>
//   );
// };
// const renderCurrency = (value, row, index) => {
//   return (
//     <CurrencyFormat
//       className={`${row.pToOrder === 1 ? "green" : ""}
//   ${row.ptoCheck === 1 ? "red" : ""}`}
//       value={value}
//       displayType={"text"}
//       thousandSeparator={true}
//     />
//   );
// };

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

const DF = Form.create({ name: "df" })(TableDetail);

export default connect(
  state => state.tableDetail,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(DF);
