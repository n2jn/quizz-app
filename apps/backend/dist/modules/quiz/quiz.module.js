"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_module_1 = require("../../shared/shared.module");
const quiz_controller_1 = require("./presentation/controllers/quiz.controller");
const question_controller_1 = require("./presentation/controllers/question.controller");
const create_question_handler_1 = require("./application/commands/create-question.handler");
const start_quiz_session_handler_1 = require("./application/commands/start-quiz-session.handler");
const submit_answer_handler_1 = require("./application/commands/submit-answer.handler");
const complete_quiz_session_handler_1 = require("./application/commands/complete-quiz-session.handler");
const question_repository_1 = require("./infrastructure/repositories/question.repository");
const quiz_session_repository_1 = require("./infrastructure/repositories/quiz-session.repository");
const CommandHandlers = [
    create_question_handler_1.CreateQuestionHandler,
    start_quiz_session_handler_1.StartQuizSessionHandler,
    submit_answer_handler_1.SubmitAnswerHandler,
    complete_quiz_session_handler_1.CompleteQuizSessionHandler,
];
const Repositories = [
    {
        provide: 'IQuestionRepository',
        useClass: question_repository_1.QuestionRepository,
    },
    {
        provide: 'IQuizSessionRepository',
        useClass: quiz_session_repository_1.QuizSessionRepository,
    },
];
let QuizModule = class QuizModule {
};
exports.QuizModule = QuizModule;
exports.QuizModule = QuizModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, shared_module_1.SharedModule],
        controllers: [quiz_controller_1.QuizController, question_controller_1.QuestionController],
        providers: [...CommandHandlers, ...Repositories],
        exports: [],
    })
], QuizModule);
//# sourceMappingURL=quiz.module.js.map