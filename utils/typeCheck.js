const typeCheck = {
  isSingleInputType(input) {
    if (!this.isInputElement(input)) {
      return false
    }
    if (input instanceof HTMLInputElement) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        return false
      }
    }

    if (
      !input instanceof HTMLSelectElement ||
      !input instanceof HTMLTextAreaElement
    ) {
      return false
    }

    return true
  },
  isInputElement(input) {
    if (
      input instanceof HTMLInputElement ||
      input instanceof HTMLSelectElement ||
      input instanceof HTMLTextAreaElement
    ) {
      return true
    } else {
      return false
    }
  },
}

export default typeCheck
