import { NAMESPACE, ClassName, EventName } from 'src/js/constants'
import CardOnlineForm from './card-online-form'
import CardProcessingForm from './card-processing-form'
import FormState from 'src/js/jquery/form-state'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import InstallmentOptionsPartial from 'src/js/partials/installment-options-partial'
import PaymentIconsPartial from 'src/js/partials/payment-icons-partial'

const Selector = {
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INSTALLMENT_OPTIONS: `${NAMESPACE}_installments`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <form novalidate>
    <div class="${ClassName.HEADER}">
      Escolha a forma de parcelamento:
    </div>
    <div class="${ClassName.BODY}">
      <div class="row">
        <div class="col border-right">
          <div class="form-group text-center">
            <span id="${Selector.INPUT_AMOUNT}"></span>
            <span class="pay-method-text">Crédito</span>
          </div>
        </div>
        <div class="col">
          <span id="${Selector.INSTALLMENT_OPTIONS}"></span>
        </div>
      </div>
    </div>
    <div class="${ClassName.FOOTER} text-center">
      <button id="${Selector.BTN_GO_BACK}" type="button" class="btn-footer go-back">
        <span class="icon-arrow left"></span><br>
        <span>Voltar</span>
      </button>
      <span id="${Selector.PAY_METHODS}"></span>
      <button type="submit" class="btn-footer continue">
        <span class="icon-arrow right"></span><br>
        <span>Finalizar</span>
      </button>
    </div>
  </form>
`

class CardInstallmentsForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _bindButtons() {
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    $btnGoBack.on(EventName.CLICK, () => {
      const cardOnlineForm = new CardOnlineForm(this._$container, this._options)
      cardOnlineForm.render()
    })
  }

  _bindForm() {
    this._$form = this._$container.find('form')

    this._$form.on(EventName.SUBMIT, async () => {
      if (this._formState.invalid) return
      const cardProcessingForm = new CardProcessingForm(this._$container, this._options)
      await cardProcessingForm.render()
    })
  }

  _bindInstallments() {
    const $installmentOptions = this._$container.find(`#${Selector.INSTALLMENT_OPTIONS}`)
    this._installmentOptionsPartial = new InstallmentOptionsPartial($installmentOptions, this._options)
    this._installmentOptionsPartial.render()
  }

  _loadAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(true)
    this._inputAmountPartial.render()
  }

  _loadFormState() {
    this._formState = new FormState(this._$form)
  }

  _loadPayMethods() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._paymentIconsPartial = new PaymentIconsPartial($payMethods)
    this._paymentIconsPartial.render()
    this._paymentIconsPartial.activeIcon(this._options.payment.card.bin.cardBrand)
  }

  render() {
    this._$container.html(VIEW)

    this._bindButtons()
    this._bindForm()
    this._bindInstallments()
    this._loadAmount()
    this._loadFormState()
    this._loadPayMethods()
  }
}

export default CardInstallmentsForm
