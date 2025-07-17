export class ToursUtils {

    constructor() { }

    validationSingleInput(htmlElement: HTMLInputElement | HTMLTextAreaElement): boolean {
        const inputType = htmlElement.type
        const inputValue = htmlElement.value
        const placeholderTemp = htmlElement.placeholder
        let validFlag = true

        if (inputType === 'text' || htmlElement.tagName.toLowerCase() === 'textarea') {
            if (inputValue === '') {
                validFlag = false;
                htmlElement.placeholder = "This field is required!";
            }
        }

        else if (inputType === 'number') {
            const numberValue = Number(inputValue)
            if (inputValue === '' || isNaN(numberValue) || numberValue <= 0) {
                validFlag = false;
                htmlElement.placeholder = "Enter a valid number!";
            }
        }

        else if (inputType === 'datetime-local') {
            if (inputValue === '') {
                validFlag = false;
            }
            else {
                const inputDate = new Date(inputValue)
                const nowDate = new Date()
                if (inputDate < nowDate) {
                    validFlag = false;
                }
            }
        }

        if (!validFlag) {
            htmlElement.style.borderColor = "red"
            htmlElement.addEventListener("click", () => {
                htmlElement.style.borderColor = "black"
                htmlElement.placeholder = placeholderTemp
            })
            return false;
        }

        return true;
    }

    getSelectedRadioValue(name: string): string | null {
        const radio = document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement;
        return radio ? radio.value : null;
    }
    
}