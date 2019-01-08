import * as React from 'react';
import orderBy from 'lodash/orderBy';
import compact from 'lodash/compact';
import moment from 'moment';
import Alert from 'react-s-alert';
import { Row, Col } from 'reactstrap';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import ReactTable from 'react-table';
import { SpanClick, FormGroup } from 'components/style';

import { TariffListWrapper, AddTariffIcon } from './style';

interface Props {
  updateContract: Function;
  contract: { [key: string]: any };
  tariffs: Array<{ [key: string]: any }>;
}

interface State {
  editMode: boolean;
  selectedTariffId: null | string;
}

class TariffsList extends React.Component<Props, State> {
  state = { editMode: false, selectedTariffId: null };

  switchEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  setTariffs = (params) => {
    const { updateContract, contract } = this.props;
    new Promise((resolve, reject) => updateContract({ resolve, reject, params: { updatedAt: contract.updatedAt, tariffIds: params } })).catch(res => Alert.error(JSON.stringify(res.errors)));
  };

  setSelectedTariffId = ({ target: { value } }) => {
    this.setState({ selectedTariffId: value });
  };

  addTariff = () => {
    const { contract: { tariffs: { array: tariffs } } } = this.props;
    this.setTariffs(compact(tariffs.map(t => t.id).concat(this.state.selectedTariffId)));
  };

  deleteTariff = (tariffId) => {
    if (!confirm('Delete?')) return;
    const { contract: { tariffs: { array: tariffs } } } = this.props;
    this.setTariffs(compact(tariffs.map(t => t.id).filter(t => t !== tariffId)));
  };

  render() {
    const { tariffs, contract } = this.props;
    const { editMode } = this.state;

    const prefix = 'admin.tariffs';

    const data = orderBy(contract.tariffs.array, t => new Date(t.beginDate), 'desc').map(t => ({
      ...t,
      beginDate: moment(t.beginDate).toDate(),
      lastDate: t.lastDate ? moment(t.lastDate).toDate() : t.lastDate,
      basepriceCentsPerMonth: {
        Display: (
          <FormattedNumber
            value={(t.basepriceCentsPerMonth / 100).toFixed(2)}
            style="currency"
            currency="EUR"
            currencyDisplay="symbol"
          />
        ),
        value: t.basepriceCentsPerMonth,
      },
      energypriceCentsPerKwh: {
        Display: (
          <React.Fragment>
            <FormattedNumber value={t.energypriceCentsPerKwh} style="decimal" maximumFractionDigits={1} /> ¢
          </React.Fragment>
        ),
        value: t.energypriceCentsPerKwh,
      },
    }));

    const columns: Array<any> = [
      {
        Header: () => <FormattedMessage id={`${prefix}.tableName`} />,
        accessor: 'name',
        className: 'cy-name',
        sortable: false,
      },
      {
        Header: () => <FormattedMessage id={`${prefix}.tableBeginDate`} />,
        accessor: 'beginDate',
        className: 'cy-begin-date',
        sortable: false,
        Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
      },
      {
        Header: () => <FormattedMessage id={`${prefix}.tableLastDate`} />,
        accessor: 'lastDate',
        className: 'cy-last-date',
        sortable: false,
        Cell: ({ value }) => value ? moment(value).format('DD.MM.YYYY') : '',
      },
      {
        Header: () => <FormattedMessage id={`${prefix}.tableBasepriceCentsPerMonth`} />,
        accessor: 'basepriceCentsPerMonth',
        sortable: false,
        Cell: ({ value: { Display } }) => Display,
      },
      {
        Header: () => <FormattedMessage id={`${prefix}.tableEnergypriceCentsPerKwh`} />,
        accessor: 'energypriceCentsPerKwh',
        sortable: false,
        Cell: ({ value: { Display } }) => Display,
      },
    ];

    let contractTariffsIds: Array<string> = [];
    if (editMode) {
      columns.push({
        width: 40,
        style: { cursor: 'pointer' },
        accessor: 'deleteTariff',
        sortable: false,
        Cell: () => <i className="fa fa-2x fa-remove" />,
      });
      contractTariffsIds = contract.tariffs.array.map(t => t.id);
    }

    return (
      <TariffListWrapper>
        <h4>Contract tariffs:</h4>
        <SpanClick onClick={this.switchEditMode} className="float-right" data-cy="manage tariffs CTA">
          <FormattedMessage id="admin.contracts.manageTariffs" /> <i className="fa fa-pencil" />
        </SpanClick>
        <br />
        {editMode && (
          <React.Fragment>
            <Row>
              <Col xs={9}>
                <FormGroup>
                  <select
                    onChange={this.setSelectedTariffId}
                    className="custom-select form-control"
                    name="select-tariff"
                  >
                    <option value="">-----</option>
                    {tariffs.filter(t => !contractTariffsIds.includes(t.id)).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
              </Col>
              <Col xs={3}>
                <AddTariffIcon className="fa fa-3x fa-plus-circle cy-add-tariff" onClick={this.addTariff} />
              </Col>
            </Row>
          </React.Fragment>
        )}
        <ReactTable
          {...{
            data,
            columns,
            getTdProps: (_state, rowInfo, column) => ({
              onClick: (_e, handleOriginal) => {
                if (column.id === 'deleteTariff') this.deleteTariff(rowInfo.original.id);
                if (handleOriginal) handleOriginal();
              },
            }),
          }}
        />
      </TariffListWrapper>
    );
  }
}

export default TariffsList;
