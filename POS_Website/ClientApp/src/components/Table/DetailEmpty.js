import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../store/DetailEmpty";
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
import TableJoin from "./TableJoin";
import TableJoined from "./TableJoined";

const { TextArea, Search } = Input;

class DetailEmpty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableCode: "",
      mealPeriod: [],
      activeTime: "",
      userDefineDef: [],
      statistic: [],
      statisticSelected: [],
      clientModalVisible: false,
      currentClient: "",
      joinModalVisible: false,
      tmpIDTableJoin: "",
      room: ""
    };
  }

  async componentWillMount() {
    const tableCode = this.props.match.params.tableCode;
    const mealPeriod = await this.props.getMealPeriod();
    const userDefineDef = await this.props.getUserDefineDef();
    const statistic = await this.props.getStatistic(userDefineDef.length);
    const tmpIDTableJoin = await this.props.getTmpID();

    // console.log(statistic);
    await this.setTimeMeal(mealPeriod);
    await this.setStatistic(statistic);

    this.setState({
      mealPeriod,
      userDefineDef,
      statistic,
      tableCode,
      tmpIDTableJoin
    });

    this.props.form.setFieldsValue({
      adult: 1,
      child: 0
    });
  }
  getImageNull(item) {
    const { tableTypes } = this.props;
    return tableTypes.find(i => i.tableType1 === item.tableType).imageNull;
  }
  setTimeMeal = async mealPeriod => {
    const today = new Date();
    var hours = today.getHours().toString();
    var minutes = today.getMinutes().toString();
    if ((minutes + "").length === 1) {
      minutes = "0" + minutes;
    }
    const time = parseInt(hours + minutes);
    // console.log(time);
    var activeTime = "";
    mealPeriod.forEach(item => {
      if (time >= item.fromTime && time <= item.toTime) {
        activeTime = item.mealNo;
      }
    });
    await this.setState({
      activeTime
    });
    // console.log(res);
  };

  setStatistic = async statistic => {
    var statisticSelected = [];
    for (var i = 0; i < statistic.length; i++) {
      const a = statistic[i][0];
      statisticSelected.push(a);
    }
    await this.setState({
      statisticSelected
    });
  };

  setClientInfo = client => {
    console.log(client);
    const currentClient = {
      clientFolioNum: client.clientFolioNum,
      sClientName: client.sClientName,
      clientAdressInvoice: client.clientAdressInvoice,
      clientInvoiceName: client.invoiceName,
      clientVAT: client.vatCode
    };

    this.setState({
      currentClient,
      clientModalVisible: false
    });
  };

  showClientModal = () => {
    this.setState({
      clientModalVisible: true
    });
  };

  handleOkClient = e => {
    console.log(e);
    this.setState({
      clientModalVisible: false
    });
  };

  handleCancelClient = e => {
    console.log(e);
    this.setState({
      clientModalVisible: false
    });
  };

  showJoinModal = async () => {
    const { tableCode, tmpIDTableJoin } = this.state;

    const res = await this.props.deleteTableJoin(tableCode);
    if (res === 200) {
      this.setState({
        joinModalVisible: true
      });
    }
  };

  handleOkJoin = async joined => {
    console.log(joined);
    const { tableCode, tmpIDTableJoin } = this.state;
    const res = await this.props.addTablesJoin(
      tmpIDTableJoin,
      tableCode,
      joined
    );
    if (res === 200) {
      this.props.requestTablesJoin(tableCode, tmpIDTableJoin);
      this.setState({
        joinModalVisible: false
      });
    }
  };

  handleCancelJoin = e => {
    this.setState({
      joinModalVisible: false
    });
  };

  handleOKNewTable = async () => {
    const formValues = this.props.form.getFieldsValue();
    if (
      (!formValues.adult || formValues.adult.length < 1) &&
      (!formValues.child || formValues.length < 1)
    ) {
      message.warning("Please input Adult or Child!");
      return;
    }
    const {
      tableCode,
      statistic,
      statisticSelected,
      currentClient,
      activeTime,
      tmpIDTableJoin
    } = this.state;
    const userLogin = sessionStorage.getItem("posUser");
    const posDate = new Date(sessionStorage.getItem("posDate"));
    const data = {
      Adult: formValues.adult ? formValues.adult : "",
      Child: formValues.child ? formValues.child : "",
      RVCNo: sessionStorage.getItem("rvcNo"),
      TableMain: tableCode,
      StsCode1: statisticSelected[0],
      StsCode2: statisticSelected[1],
      StsCode3: statisticSelected[2],
      StsCode4: statisticSelected[3],
      StsCode5: statisticSelected[4],
      StsCode6: statisticSelected[5],
      WSID: "Hau",
      ClientCode: currentClient.clientFolioNum,
      MealNo: activeTime,
      // UserLogin: userLogin,
      // POSDay: posDate.getDate(),
      // POSMonth: posDate.getMonth() + 1,
      // POSYear: posDate.getFullYear(),
      tmpJoinTable: tmpIDTableJoin,
      TableInfo: formValues.tableInfo,
      RoomCode: formValues.room,
      ClientName: currentClient.sClientName,
      ClientInvoiceName: currentClient.clientInvoiceName,
      ClientAdressInvoice: currentClient.clientAdressInvoice,
      ClientVAT: currentClient.clientVAT
    };
    // console.log(data);
    const res = await this.props.okNewTable(data);
    if (res.status === 200) {
      console.log(res);
      this.props.history.push(`/tableDetail/${res.data[0].checkNo}`);
    }
  };

  handleInputRoom = e => {
    this.setState({
      room: e.target.value
    });
  };

  handleChangeStatistic = (index, changeStsCode) => {
    const { statistic, statisticSelected } = this.state;
    const sta = statistic[index].find(item => item.stsCode === changeStsCode);
    statisticSelected[index] = sta;
    this.setState({
      statisticSelected
    });
  };

  handleCancelNewTable = async () => {
    const { tmpIDTableJoin } = this.state;
    console.log(tmpIDTableJoin);
    const res = await this.props.cancelNewTable(tmpIDTableJoin);
    console.log(res);
    if (res.status === 200) {
      window.location.replace("/");
    }
  };

  render() {
    // const { isLoading, notiCashier } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const {
      tableCode,
      mealPeriod,
      activeTime,
      userDefineDef,
      statistic,
      statisticSelected,
      currentClient,
      room
    } = this.state;
    const { clientList, tablesJoin } = this.props;

    const columns = [
      {
        title: "Code",
        dataIndex: "clientFolioNum",
        key: "clientFolioNum",
        render: (text, row, index) => {
          return (
            <Button onClick={() => this.setClientInfo(row)} type="link">
              {text}
            </Button>
          );
        }
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "Client Name",
        dataIndex: "sClientName",
        key: "sClientName"
      },
      {
        title: "Type",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Phone Number",
        dataIndex: "tel1",
        key: "tel1"
      },
      {
        title: "Address",
        dataIndex: "districtCommunices",
        key: "districtCommunices"
      },
      {
        title: "Action",
        dataIndex: "",
        key: "districtCommunices"
      }
    ];

    // console.log(statisticSelected);
    return (
      <div className="detail-page">
        <div className="actions-header">
          <Button
            className="cancel-btn"
            size="large"
            icon="stop"
            onClick={() => this.handleCancelNewTable()}
            title="Cancel"
          />
          <Button
            size="large"
            style={{ float: "right" }}
            title="OK"
            className="check-btn"
            onClick={() => this.handleOKNewTable()}
            icon="check"
          />
        </div>
        <div className="de-menus">
          {mealPeriod &&
            mealPeriod.map(item => (
              <Button
                size="large"
                type="primary"
                className={activeTime === item.mealNo && "active"}
                onClick={() => this.setState({ activeTime: item.mealNo })}
              >
                {item.mealName}
              </Button>
            ))}
        </div>
        <div className="de-info">
          <Row gutter={16}>
            <Col span={8}>
              <div className="left">
                <div className="header">
                  <Icon className="icon" type="info-circle" />
                  Table Information
                </div>
                <div className="body">
                  <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Table">
                      {getFieldDecorator("table", {
                        initialValue: tableCode
                      })(<Input disabled />)}
                    </Form.Item>
                    <Form.Item label="Room">
                      {getFieldDecorator("room")(<Input />)}
                    </Form.Item>
                    <Form.Item label="Adult">
                      {getFieldDecorator("adult")(<Input />)}
                    </Form.Item>
                    <Form.Item label="Child">
                      {getFieldDecorator("child")(<Input />)}
                    </Form.Item>
                    <Form.Item label="Notes">
                      {getFieldDecorator("tableInfo")(<TextArea />)}
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Col>
            <Col span={16} className="sts">
              <div className="header">
                <Icon className="icon" type="pie-chart" />
                Statistics
              </div>
              <div className="body">
                {userDefineDef &&
                  userDefineDef.map((item, i) => (
                    <div className="sts-s">
                      <Row>
                        <Col span={6}>
                          <span className="sts-t">{item.content}</span>
                        </Col>
                        <Col span={18}>
                          <Select
                            value={statisticSelected[i].stsName}
                            style={{ width: 120 }}
                            className="sts-v"
                            onChange={changeStsCode =>
                              this.handleChangeStatistic(i, changeStsCode)
                            }
                          >
                            {statistic[i].map(stsItem => (
                              <Select.Option value={stsItem.stsCode}>
                                {stsItem.stsName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Col>
                      </Row>
                    </div>
                  ))}
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div className="left">
                <div className="header">
                  <Icon className="icon" type="user" />
                  Client Information
                  <Icon
                    type="search"
                    className="header-icon"
                    onClick={this.showClientModal}
                  ></Icon>
                </div>
                <div className="body" style={{ textAlign: "center" }}>
                  {currentClient && (
                    <p>
                      {currentClient.clientFolioNum} -
                      {currentClient.sClientName}
                    </p>
                  )}
                </div>
              </div>
            </Col>
            <Col span={16}>
              <div className="header">
                <Icon className="icon" type="vertical-align-middle" />
                Table Join
              </div>
              <div className="body">
                <div>
                  <TableJoined tables={tablesJoin} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <Button
                    onClick={() => this.showJoinModal()}
                    type="primary"
                    ghost
                  >
                    Join Tables
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          className="client-modal"
          title="Search Client Information"
          visible={this.state.clientModalVisible}
          onOk={this.handleOkClient}
          onCancel={this.handleCancelClient}
        >
          <Search
            placeholder="input search text"
            onSearch={value => this.props.requestClientList(value)}
            enterButton
            style={{ marginBottom: "1em" }}
          />
          <Table dataSource={clientList} columns={columns} />
        </Modal>
        <Modal
          className="join-modal"
          title="Join Tables"
          visible={this.state.joinModalVisible}
          onOk={this.handleOkJoin}
          onCancel={this.handleCancelJoin}
        >
          <TableJoin
            tableCode={tableCode}
            cancelJoin={this.handleCancelJoin}
            okJoin={this.handleOkJoin}
          />
        </Modal>
      </div>
    );
  }
}

const DE_FORM = Form.create({ name: "de" })(DetailEmpty);

export default connect(
  state => state.detailEmpty,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(DE_FORM);
