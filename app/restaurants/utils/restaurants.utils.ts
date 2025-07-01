export class RestaurantUtils{

    constructor(){

    }
    
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

        else if (inputType === 'url') {
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(inputValue)) {
                validFlag = false;
                htmlElement.placeholder = "Enter a valid URL!";
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


    validationFinal(htmlElement: HTMLInputElement | HTMLTextAreaElement): boolean {
        const inputType = htmlElement.type
        const inputValue = htmlElement.value
        let validFlag = true

        if (inputType === 'text' || htmlElement.tagName.toLowerCase() === 'textarea') {
            if (inputValue === '') {
                validFlag = false;
            }
        }

        else if (inputType === 'number') {
            const numberValue = Number(inputValue)
            if (inputValue === '' || isNaN(numberValue) || numberValue <= 0) {
                validFlag = false;
            }
        } 
        
        else if (inputType === 'url') {
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(inputValue)) {
                validFlag = false;
            }
        }


        if (!validFlag) {
            return false;
        }
        return true;
    }
}