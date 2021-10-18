"use strict";

const {
  isArray,
  toSanitizedModel,
  toSanitizedModels,
} = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async prepareAnswersForQuestions(questions) {
    if (questions) {
      await Promise.all(
        questions.map((question) => {
          return new Promise(async (resolve) => {
            const answers = await strapi
              .query("feeling-checkin-option")
              .model.find({ Question: question.id })
              .select("Type Answer Value id");
            if (answers) {
              const ansModel = toSanitizedModels(
                answers,
                strapi.models["feeling-checkin-option"]
              );
              question.Answers = ansModel;
            }
            resolve(question);
          });
        })
      );
    }
  },

  async getFormByName(name, fetchDetailAnswers) {
    const list = await strapi
      .query("feeling-checkin-form")
      .find({ Name: name });
    const model =
      !!list && isArray(list) && !!list.length
        ? toSanitizedModel(list[0], strapi.models["feeling-checkin-form"])
        : null;
    if (fetchDetailAnswers) {
      await this.prepareAnswersForQuestions(model.Questions);
    }
    return model;
  },

  async getFormById(id, fetchDetailAnswers) {
    const list = await strapi.query("feeling-checkin-form").find({ id });
    const model =
      !!list && isArray(list) && !!list.length
        ? toSanitizedModel(list[0], strapi.models["feeling-checkin-form"])
        : null;
    if (fetchDetailAnswers) {
      await this.prepareAnswersForQuestions(model.Questions);
    }
    return model;
  },

  // Sample of fetch answer by bitwise
  // A: 001
  // B: 010
  // C: 100
  // Condition: 1 10 100 (A OR B OR C)
  // Condition: 111 (A AND B AND C)
  // Condition: 101 (A AND C)
  // Condition: 110 (B AND C)
  async getNextFormByAnswers(currentFormName, answers) {
    const currentForm = await this.getFormByName(currentFormName, true);
    if (currentForm) {
      const questions = currentForm.Questions;
      const actualAnswers = questions.map((x, qInx) => {
        return (
          (isArray(x.Answers) &&
            x.Answers.map((qAns, i) => {
              return {
                bit: answers[qInx]?.some((ans) => qAns.id === ans.id)
                  ? Math.pow(10, i)
                  : 0,
              };
            })) ||
          []
        );
      });
      // Pair actual answers
      const pairActualAnswers = [];
      actualAnswers.forEach((ans) => {
        pairActualAnswers.push([]);
        ans.forEach((a, currentInx) => {
          pairActualAnswers[pairActualAnswers.length - 1].push(a.bit);
          if (currentInx + 1 < ans.length) {
            for (let i = currentInx + 1; i < ans.length; i++) {
              const b = ans[i];
              pairActualAnswers[pairActualAnswers.length - 1].push(
                a.bit + b.bit
              );
            }
          }
        });
      });
      const nextFormIds = currentForm.NextForms;
      if (isArray(nextFormIds)) {
        if (nextFormIds.length > 1) {
          const nextForms = await Promise.all(
            nextFormIds.map((id) => {
              return this.getFormById(id);
            })
          );
          const found = nextForms.find((form) => {
            // Use count by operators
            if (form.UseCount) {
              const answersCount = answers?.flat()?.length || 0;
              const operator = form.Operator;
              switch (operator) {
                case "less": {
                  return answersCount < form.Count;
                }
                case "less_or_equal": {
                  return answersCount <= form.Count;
                }
                case "greater": {
                  return answersCount > form.Count;
                }
                case "greater_or_equal": {
                  return answersCount >= form.Count;
                }
                case "not_equal": {
                  return answersCount !== form.Count;
                }
                case "equal":
                default: {
                  return answersCount === form.Count;
                }
              }
            }
            // Use condition
            const condition = form.Condition;
            const splittedConditions = condition.split(",");
            if (splittedConditions.length) {
              // Compare splittedConditions with actualAnswer
              return splittedConditions.every((c, sId) => {
                const options = c.split(" ");
                return options.some(
                  (o) =>
                    !pairActualAnswers[sId].length ||
                    pairActualAnswers[sId]?.includes(parseInt(o))
                );
              });
            }
            return false;
          });
          await this.prepareAnswersForQuestions(found?.Questions);
          return found;
        }
        const found =
          nextFormIds.length &&
          nextFormIds[0] &&
          (await this.getFormById(nextFormIds[0]));
        await this.prepareAnswersForQuestions(found?.Questions);
        return found;
      }
    }
    return null;
  },
};
