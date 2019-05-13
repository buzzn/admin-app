import React, { useState } from 'react';
import snakeCase from 'lodash/snakeCase';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';
import Alert from 'react-s-alert';
import Loading from 'components/loading';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableCheckbox from 'components/editable_checkbox';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';
import { DeleteButton } from 'components/style';
import { mainStyle as baseStyle } from 'components/react_select_styles';

const mainStyle = {
  ...baseStyle,
  container: base => ({
    ...base,
    width: '100%',
  }),
};

interface Props {
  editMode: boolean;
  switchEditMode: () => void;
  reset: () => void;
  pristine: boolean;
  submitting: boolean;
  handleSubmit: Function;
  group: { [key: string]: any };
  deleteGroup: Function;
  updateGroup: Function;
  address: { [key: string]: any };
  loadAvailableOrganizationMarkets: () => void;
  availableOrganizationMarkets: { _status: null | number; array: any[] };
  loadingOptions: boolean;
  validationRules: any;
}

const Form = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  validationRules,
  updateGroup,
  group,
  deleteGroup,
  loadAvailableOrganizationMarkets,
  availableOrganizationMarkets,
  loadingOptions,
  editMode,
  switchEditMode,
}: Props) => {
  const [groupOrgMarket, setGroupOrgMarket] = useState({});
  const orgMarketOptions = {
    transmissionSystemOperator: [],
    distributionSystemOperator: [],
    electricitySupplier: [],
  };

  const submitForm = values => new Promise((resolve, reject) => {
    const params = JSON.parse(JSON.stringify(values));
    delete params.allowedActions;
    delete params.createables;
    delete params.incompleteness;
    delete params.owner;
    delete params.tariffs;
    delete params.showContact;
    delete params.showEnergy;
    delete params.showObject;
    delete params.showProduction;
    delete params.showDisplayApp;
    params.fakeStats = JSON.stringify(params.fakeStats || {});
    params.orgMarket = {};
    Object.keys(orgMarketOptions).forEach(om => {
      if (groupOrgMarket[om] && groupOrgMarket[om].value !== (group[om] || {}).id) params.orgMarket[om] = groupOrgMarket[om].value;
    });
    updateGroup({
      groupId: group.id,
      params,
      resolve,
      reject,
    });
  }).then(() => {
    Alert.success('Saved!');
    switchEditModeWrap();
  });

  const switchEditModeWrap = () => {
    if (!editMode) {
      loadAvailableOrganizationMarkets();
    } else {
      setGroupOrgMarket({});
    }
    switchEditMode();
  };

  const prefix = 'admin.groups';
  const addressPrefix = 'admin.addresses';

  const defaultOption = { value: undefined, label: '-----' };

  Object.keys(orgMarketOptions).forEach((orgMarketType) => {
    orgMarketOptions[orgMarketType] = [defaultOption].concat(
      availableOrganizationMarkets.array
        .filter(o => o.marketFunctions.array.find(mf => mf.function === snakeCase(orgMarketType)))
        .map(o => ({ value: o.id, label: o.name })),
    );
  });

  return (
    <Col xs="12">
      <form onSubmit={handleSubmit(submitForm)}>
        <p className="h5 grey-underline header text-uppercase">
          <FormattedMessage id={`${prefix}.headerGroup`} />
          {!editMode && group.updatable && (
            <i
              data-cy="group edit switch"
              className="buzzn-pencil"
              style={{ float: 'right' }}
              onClick={switchEditModeWrap}
            />
          )}
        </p>
        <FormPanel
          {...{
            editMode,
            dirty: !pristine,
            onCancel: () => {
              reset();
              switchEditModeWrap();
            },
            cancelDisabled: submitting,
            onSave: handleSubmit(submitForm),
            saveDisabled: (pristine && !Object.keys(groupOrgMarket).length) || submitting,
          }}
        >
          <TwoColField
            {...{
              prefix,
              name: 'name',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix: addressPrefix,
              name: 'address.street',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix: addressPrefix,
              name: 'address.zip',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix: addressPrefix,
              name: 'address.city',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'startDate',
              editMode,
              validationRules,
              component: EditableDate,
              normalize: dateNormalizer('YYYY-MM-DD'),
            }}
          />
          {editMode ? (
            loadingOptions ? (
              <Loading minHeight={10} />
            ) : (
              <React.Fragment>
                <Row className="fieldgroup">
                  <Col xs="6" className="fieldname">
                    <FormattedMessage id={`${prefix}.transmissionSystemOperator`} />
                  </Col>
                  <Col xs="6" className="grey-underline fieldvalue p-0">
                    <Select
                      options={orgMarketOptions.transmissionSystemOperator}
                      onChange={transmissionSystemOperator => setGroupOrgMarket({ ...groupOrgMarket, transmissionSystemOperator })
                      }
                      styles={mainStyle}
                      defaultValue={
                        group.transmissionSystemOperator
                          ? { value: group.transmissionSystemOperator.id, label: group.transmissionSystemOperator.name }
                          : defaultOption
                      }
                    />
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="6" className="fieldname">
                    <FormattedMessage id={`${prefix}.distributionSystemOperator`} />
                  </Col>
                  <Col xs="6" className="grey-underline fieldvalue p-0">
                    <Select
                      options={orgMarketOptions.distributionSystemOperator}
                      onChange={distributionSystemOperator => setGroupOrgMarket({ ...groupOrgMarket, distributionSystemOperator })
                      }
                      styles={mainStyle}
                      defaultValue={
                        group.distributionSystemOperator
                          ? { value: group.distributionSystemOperator.id, label: group.distributionSystemOperator.name }
                          : defaultOption
                      }
                    />
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="6" className="fieldname">
                    <FormattedMessage id={`${prefix}.electricitySupplier`} />
                  </Col>
                  <Col xs="6" className="grey-underline fieldvalue p-0">
                    <Select
                      options={orgMarketOptions.electricitySupplier}
                      onChange={electricitySupplier => setGroupOrgMarket({ ...groupOrgMarket, electricitySupplier })}
                      styles={mainStyle}
                      defaultValue={
                        group.electricitySupplier
                          ? { value: group.electricitySupplier.id, label: group.electricitySupplier.name }
                          : defaultOption
                      }
                    />
                  </Col>
                </Row>
              </React.Fragment>
            )
          ) : (
            <React.Fragment>
              <Row className="fieldgroup">
                <Col xs="6" className="fieldname">
                  <FormattedMessage id={`${prefix}.transmissionSystemOperator`} />
                </Col>
                <Col xs="6" className="grey-underline fieldvalue">
                  {(group.transmissionSystemOperator || {}).name}
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="6" className="fieldname">
                  <FormattedMessage id={`${prefix}.distributionSystemOperator`} />
                </Col>
                <Col xs="6" className="grey-underline fieldvalue">
                  {(group.distributionSystemOperator || {}).name}
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="6" className="fieldname">
                  <FormattedMessage id={`${prefix}.electricitySupplier`} />
                </Col>
                <Col xs="6" className="grey-underline fieldvalue">
                  {(group.electricitySupplier || {}).name}
                </Col>
              </Row>
            </React.Fragment>
          )}
          <TwoColField
            {...{
              prefix,
              name: 'legacyPowerTakerContractBuzznid',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'legacyPowerGiverContractBuzznid',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'billingDetail.automaticAbschlagAdjust',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableCheckbox,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'billingDetail.automaticAbschlagThresholdCents',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
              normalize: numberNormalizer,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'billingDetail.issuesVat',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableCheckbox,
            }}
          />
          {editMode && group.deletable && (
            <Row>
              <Col xs="12">
                <br />
                <DeleteButton
                  data-cy="group delete button"
                  className="btn btn-primary"
                  onClick={() => {
                    switchEditMode();
                    deleteGroup();
                  }}
                >
                  <FormattedMessage id="admin.buttons.delete" />
                </DeleteButton>
              </Col>
            </Row>
          )}
        </FormPanel>
      </form>
    </Col>
  );
};

export default reduxForm({
  form: 'groupUpdateForm',
  enableReinitialize: true,
})(withEditOverlay(Form));
