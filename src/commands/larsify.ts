import { RunEvent } from "../interfaces";

const LARS_WORD_EXCEPTIONS = ["gutt", "gambl", "gang"];

const changeChars = (word: string, exception: boolean): string => {
  const wordLetters = word.split("");

  const newWordLetters: string[] = new Array();
  if (exception) {
    for (let i = 0; i < wordLetters.length; i++) {
      if (wordLetters[i] === "r") {
        newWordLetters.push("w");
      } else if (i != 0 && wordLetters[i] === "a") {
        newWordLetters.push("aa");
      } else if (wordLetters[i] === "l") {
        newWordLetters.push("lh");
      } else {
        newWordLetters.push(wordLetters[i]);
      }
    }
    return newWordLetters.join("");
  } else {
    for (let i = 0; i < wordLetters.length; i++) {
      if (i === 0 && wordLetters[i] === "g") {
        newWordLetters.push("kh");
      } else if (wordLetters[i] === "r") {
        newWordLetters.push("w");
      } else if (i != 0 && wordLetters[i] === "a") {
        newWordLetters.push("aa");
      } else if (wordLetters[i] === "l") {
        newWordLetters.push("lh");
      } else {
        newWordLetters.push(wordLetters[i]);
      }
    }
    return newWordLetters.join("");
  }
};

export const run = (event: RunEvent) => {
  const tokens = event.args;
  const word = tokens
    .map((ord) => {
      const lowerCaseWord = ord.toLocaleLowerCase();
      let exception: boolean = false;
      for (let w of LARS_WORD_EXCEPTIONS) {
        if (lowerCaseWord.includes(w)) {
          exception = true;
        }
      }
      return changeChars(lowerCaseWord, exception);
    })
    .join(" ");

  event.message.reply(word + " sheeeeesh");
};

export const names = ["larsify"];
