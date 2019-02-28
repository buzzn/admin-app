import * as React from 'react';
import omit from 'lodash/omit';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col } from 'reactstrap';
import Select from 'react-select';
import { Link, Prompt } from 'react-router-dom';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { mainStyle } from 'components/react_select_styles';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableSelect from 'components/editable_select';
import { dateNormalizer } from 'validation_normalizers';

import { RegisterMetaErrors } from '../add_powertaker/style';

interface Props {
  url: string;
  history: any;
  setEditMode: (boolean) => void;
  editMode: boolean;
  loadMarketLocations: () => void;
  addContract: (any) => void;
  marketLocations: { _status: null | number; array: Array<any> };
  pristine: boolean;
  submitting: boolean;
  handleSubmit: Function;
  change: Function;
  validationRules: { lpthird: {} };
  addThirdPartyErrors: { registerMeta?: Array<any> };
}

interface State {
  selectedMaLo: null | { value: null | string; label: string };
  saved: boolean;
}

class AddThirdParty extends React.Component<Props, State> {
  state = {
    selectedMaLo: null,
    saved: false,
  };

  componentDidMount() {
    const { loadMarketLocations } = this.props;
    this.props.setEditMode(true);
    loadMarketLocations();
  }

  componentWillUnmount() {
    this.props.setEditMode(false);
  }

  handleMaLoChange = (param) => {
    const { change } = this.props;
    change('registerMeta.id', param ? param.value : param);
    this.setState({ selectedMaLo: param });
  };

  submitForm = (values) => {
    let params = JSON.parse(JSON.stringify(values));
    const { addContract, history, url } = this.props;
    const { selectedMaLo } = this.state;
    const maLoValue = (selectedMaLo || { value: null }).value;
    if (maLoValue) {
      params.registerMeta = { id: maLoValue };
    } else {
      params = omit(params, 'registerMeta.id');
    }

    return new Promise((resolve, reject) => {
      addContract({
        params: {
          // server validator hack
          registerMeta: {},
          ...params,
          type: 'contract_localpool_third_party',
        },
        resolve,
        reject,
      });
    }).then(() => {
      this.setState({ saved: true });
      history.push(url);
    });
  };

  render() {
    const {
      marketLocations,
      handleSubmit,
      validationRules: { lpthird: validationRules },
      history,
      url,
      pristine,
      submitting,
      editMode,
      addThirdPartyErrors,
    } = this.props;

    const { selectedMaLo, saved } = this.state;
    const maLoValue = (selectedMaLo || { value: null }).value;
    const maLoOptions: Array<{ value: null | string; label: string }> = [{ value: null, label: 'Create new' }].concat(
      marketLocations.array.map(u => ({ value: u.id, label: `${u.name} ${u.kind}` })),
    );

    const prefix = 'admin.contracts';

    return (
      <Col xs="12">
        <form onSubmit={handleSubmit(this.submitForm)} data-cy="create powertaker form">
          <FormPanel
            {...{
              editMode,
              dirty: !pristine,
              onCancel: () => {
                history.push(url);
              },
              cancelDisabled: submitting,
              onSave: handleSubmit(this.submitForm),
              saveDisabled: pristine || submitting,
            }}
          >
            <p className="h5 grey-underline header text-uppercase">
              <FormattedMessage id={`${prefix}.headerAddThirdParty`} />
            </p>
            <Select options={maLoOptions} onChange={this.handleMaLoChange} styles={mainStyle} value={selectedMaLo} />
            <Prompt
              when={!pristine && !saved}
              message={location => (location.pathname === url
                ? true
                : `You have unsaved data in form. Are you sure you want to go to ${location.pathname}`)
              }
            />
            {Array.isArray(addThirdPartyErrors.registerMeta) && (
              <RegisterMetaErrors>
                {addThirdPartyErrors.registerMeta
                  .filter(e => e !== null && typeof e === 'object')
                  .map((e, i) => (
                    <li key={i}>
                      <FormattedMessage id={`${prefix}.${e.error}`} />{' '}
                      <Link to={`${url}/${e.contractId}`}>Contract id: {e.contractId}</Link>
                    </li>
                  ))}
              </RegisterMetaErrors>
            )}
            <br />
            {!maLoValue && (
              <React.Fragment>
                <TwoColField
                  {...{
                    prefix,
                    name: 'registerMeta.name',
                    editMode,
                    validationRules,
                    component: EditableInput,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: 'registerMeta.label',
                    editMode,
                    validationRules,
                    component: EditableSelect,
                  }}
                />
              </React.Fragment>
            )}
            <h5 className="grey-underline mt-5 pb-2">
              <FormattedMessage id={`${prefix}.headerDates`} />
            </h5>
            <TwoColField
              {...{
                prefix,
                name: 'signingDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'beginDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'terminationDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'lastDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
          </FormPanel>
        </form>
      </Col>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  // HACK: see #3729, #3362 in redux-form
  keepDirtyOnReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { initialize }) => {
    initialize({});
  },
})(withEditOverlay(AddThirdParty));
