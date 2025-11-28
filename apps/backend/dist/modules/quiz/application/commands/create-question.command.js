"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestionCommand = void 0;
class CreateQuestionCommand {
    constructor(text, explanation, categoryId, difficultyId, createdById, answers, imageUrl) {
        this.text = text;
        this.explanation = explanation;
        this.categoryId = categoryId;
        this.difficultyId = difficultyId;
        this.createdById = createdById;
        this.answers = answers;
        this.imageUrl = imageUrl;
    }
}
exports.CreateQuestionCommand = CreateQuestionCommand;
//# sourceMappingURL=create-question.command.js.map