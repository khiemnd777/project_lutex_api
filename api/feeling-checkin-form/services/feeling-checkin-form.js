"use strict";

const { isArray, toSanitizedModel } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getFormByName(name) {
    const list = await strapi
      .query("feeling-checkin-form")
      .find({ Name: name });
    return !!list && isArray(list) && !!list.length
      ? toSanitizedModel(list[0], strapi.models["feeling-checkin-form"])
      : null;
  },

  async getFormById(id) {
    const list = await strapi.query("feeling-checkin-form").find({ id });
    return !!list && isArray(list) && !!list.length
      ? toSanitizedModel(list[0], strapi.models["feeling-checkin-form"])
      : null;
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
    const currentForm = await this.getFormByName(currentFormName);
    if (currentForm) {
      const questions = currentForm.Questions;
      const actualAnswers = questions
        .map((x, qInx) => {
          return x.Answers.map((ansId, i) => {
            return {
              bit: answers[qInx]?.some((ans) => ans.id === ansId)
                ? Math.pow(10, i)
                : 0,
            };
          });
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
              pairActualAnswers[pairActualAnswers.length - 1].push(a.bit + b.bit);
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
          var found = nextForms.find((form) => {
            // Use count by operators
            if (form.UseCount) {
              const answersCount = answers.length;
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
                return options.some((o) =>
                  pairActualAnswers[sId]?.includes(parseInt(o))
                );
              });
            }
            return false;
          });
          return found;
        }
        return (
          nextFormIds.length &&
          nextFormIds[0] &&
          (await this.getFormById(nextFormIds[0]))
        );
      }
    }
    return null;
  },
};
