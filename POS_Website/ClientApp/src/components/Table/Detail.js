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
  Modal
} from "antd";
import moment from "moment";
import * as CurrencyFormat from "react-currency-format";
import BackspaceIcon from "../../assets/images/backspace-icon.png";

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
      quantity: "0",
      cQMVisible: false,
      aRMVisible: false,
      selectedRow: "",
      isOtherRequest: false,
      otherRequest: "",
      classRequests: [],
      itemRequests: [],
      isChoosingRequest: false
    };
  }

  async componentWillMount() {
    // this.props.requestNotiCashier();
    await this.props.requestMenus(0);
    await this.props.requestCourse();
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

  getHoursPassed = openTime => {
    const date1 = moment(new Date(openTime));
    const date2 = moment(new Date());
    var diffInHours = date2.diff(date1, "hours");
    var minutes = new Date(openTime).getMinutes() - new Date().getMinutes();
    // var diffInMinutes = date2.diff(date1, "minutes");
    // const res = diffInHours + " : " + minutes;
    const res = diffInHours;
    return res;
  };

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

  handleCancelUpdateQuantity = async e => {
    await this.setState({
      cQMVisible: false
    });
  };

  handleUpdateQuantity = async () => {
    const { selectedRow } = this.state;
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
      console.log("object");
      plus = quantity;
    } else {
      console.log(">1");
      plus = this.state.quantity + "" + quantity;
    }
    this.setState({
      quantity: plus
    });
  };

  clickRemoveQuantity = () => {
    const { quantity } = this.state;
    console.log(quantity.length);

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
      isOtherRequest
    } = this.state;
    const { menus, mainMenus, course, billDetail, requests } = this.props;
    // console.log(course);
    console.log(requests);
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
                            {this.getHoursPassed(tableDetail.openTime)}
                          </span>
                        </Col>
                        <Col span={2}>
                          <span className="info-btn">
                            <Icon type="info" />
                          </span>
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
                  </Col>
                  <Col className={` ${viewSum === 1 ? `close` : ``}`}>
                    <div className="ifz-2">
                      <Icon type="book" />
                      <Button
                        type="primary"
                        onClick={() => this.selectCourse(0)}
                        className={selectedCourse === 0 && "active"}
                      >
                        ALL
                      </Button>
                      {course.map(c => (
                        <Button
                          onClick={() => this.selectCourse(c)}
                          className={selectedCourse === c && "active"}
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
                    <div className="ifz-3">
                      <Button
                        type="primary"
                        icon="plus-square"
                        size="large"
                        onClick={() => this.sum()}
                      />
                      <Button type="primary" icon="scissor" size="large" />
                      <Button
                        type="primary"
                        icon="pause-circle"
                        size="large"
                        onClick={() => this.hold()}
                      />
                    </div>
                  </Col>
                  <div className={`bz ${viewSum === 1 ? `close` : ``}`}>
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
                    <Col>
                      <div className="ab">
                        <Row>
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
                        </Row>
                      </div>
                    </Col>
                  </div>
                </Row>
              </div>
            </Col>
            <Col xs={24} xl={14}>
              <div className="order-zone">
                <Row>
                  <Col>
                    <div className="oib">
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
                    </div>
                  </Col>
                  <Col>
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

                    <div className="oz">
                      <div className="menus-zone">
                        {menus.map(menu => (
                          <div
                            className={`order-item ${currentMenu ===
                              menu.menuNo && "active"}`}
                            onClick={() =>
                              this.handleClickMenu(
                                menu.menuNo,
                                menu.menuName,
                                menu.hasSubMenu
                              )
                            }
                          >
                            <Row>
                              <Col span={10}>
                                <img
                                  className="image"
                                  src={`data:image/png;base64, ${menu.image}`}
                                />
                              </Col>
                              <Col span={14}>
                                <div className="oi-text">
                                  <p>{menu.menuName}</p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
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
