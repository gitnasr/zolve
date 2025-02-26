import { ChromeEngine } from "../../../Chrome/Utils";
import { QuestionWithOptions } from "../../../types";
import { Helper } from "../../../utils";

export class MicrosoftFormsScrapper {
  private readonly Selectors = {
    QuestionItem: "div[data-automation-id='questionItem']",
    QuestionList: "#question-list",
    QuestionHeaderParent: "span[data-automation-id='questionTitle']",
    QuestionContent: "span[class='text-format-content ']",
    QuestionNumber: "span[data-automation-id='questionOrdinal']",
    RadioOption: "div[role='radiogroup']",
    CheckboxOption: "div[role='group']",
  };

  private _formId: string = "";
  public get formId(): string {
    const url = new URL(window.location.href);
    this._formId = url.search.split("?id=")[1];
    return this._formId;
  }

  public async Scrape() {
    const QuestionWithOptions: QuestionWithOptions = [];

    const QuestionList = document.querySelector(this.Selectors.QuestionList);
    if (QuestionList) {
      const QuestionItems = QuestionList.querySelectorAll(
        this.Selectors.QuestionItem
      );
      const QuestionItemsAsArray = Array.from(QuestionItems);
      for (let index = 0; index < QuestionItemsAsArray.length; index++) {
        const element = QuestionItemsAsArray[index];

        element
          .querySelectorAll(this.Selectors.QuestionHeaderParent)
          .forEach((header) => {
            const qNumber = header
              .querySelector(this.Selectors.QuestionNumber)
              ?.textContent?.replace(".", "");
            const title = header.querySelector(
              this.Selectors.QuestionContent
            )?.textContent;
            // try to get if it's a multiple choice question or radio
            const radioOption = element.querySelector(
              this.Selectors.RadioOption
            );
            const checkboxOption = element.querySelector(
              this.Selectors.CheckboxOption
            );

            if (radioOption) {
              const options = radioOption.querySelectorAll("label");
              const optionsArray = Array.from(options).map(
                (option) => option.textContent
              );
              const IsReady = optionsArray.length > 0 && title && qNumber;

              if (!IsReady) return;
              QuestionWithOptions.push({
                question: title,
                options: optionsArray as string[],
                isMultipleChoice: false,
                number: parseInt(qNumber),
              });
            }

            if (checkboxOption) {
              const options = checkboxOption.querySelectorAll("label");
              const optionsArray = Array.from(options).map(
                (option) => option.textContent
              );
              const IsReady = optionsArray.length > 0 && title && qNumber;

              if (!IsReady) return;
              QuestionWithOptions.push({
                question: title,
                options: optionsArray as string[],
                isMultipleChoice: true,
                number: parseInt(qNumber),
              });
            }
          });
      }

      const ArrayFormattedQuestions: string[] = [];

      for (let index = 0; index < QuestionWithOptions.length; index++) {
        const q = QuestionWithOptions[index];

        const text_format = `
                <question>
                Question #${q.number} (${
          q.isMultipleChoice
            ? "Could have multiple answers"
            : "Only one answer valid"
        }): 
                  
                ${q.question}
                
                And the options that's available are:
    
                ${q.options.map((option, i) => {
                  return ` Option: ${i + 1} : ${option} \n`;
                })} 
                
                </question>
                `;
        ArrayFormattedQuestions.push(text_format);
      }
      /**
       * Split the array into chunks of 5, this is to avoid sending too much data to AI Agent to avoid token limit
       * So we split the array into chunks of 5 questions
       */
      const ArrayOfArrayOfQuestions = Helper.SplitArrayIntoChucks(
        ArrayFormattedQuestions,
        5
      );

      return ArrayOfArrayOfQuestions;
    } else {
      ChromeEngine.sendNotification(
        "No questions found",
        "You need to be on a form page to scrape questions"
      );
    }
  }
}
