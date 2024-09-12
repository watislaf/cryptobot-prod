// import tg from 'node-telegram-bot-api';
// import TelegramBot from 'node-telegram-bot-api';
//
// const WHITELIST = [295456207, 212212103];
//
// export class TelegramService {
//   bot: TelegramBot;
//   allowedChatIds: number[] = WHITELIST;
//
//   constructor() {
//     this.bot = new tg(TELEGRAM_TOKEN, { polling: true });
//
//     this.bot.on('message', (msg: any) => {
//       const chatId = msg.chat.id;
//
//       if (!this.allowedChatIds.includes(chatId)) {
//         this.bot.sendMessage(
//           chatId,
//           `You are not an authorized user. Contact support for resolving this issue`
//         );
//         return;
//       }
//
//       this.handleCommand(msg, chatId);
//     });
//   }
//
//   handleCommand(msg: any, chatId: number) {
//     const text = msg.text.trim();
//     const command = text.split(' ')[0];
//     const paramsInput = text.substring(command.length).trim();
//
//     switch (command) {
//       case '/getAlgoStatus':
//         this.getAlgoStatus(chatId);
//         break;
//       case '/stopAlgo':
//         this.stopAlgo(chatId);
//         break;
//       case '/runAlgo':
//         this.runAlgo(chatId, paramsInput);
//         break;
//       default:
//         this.sendToAllUsers(`Unknown command: ${command}`);
//     }
//   }
//
//   async getAlgoStatus(chatId: number) {
//     const status = taskService.getStatus();
//     this.sendToAllUsers(
//       `Algorithm is ${status.isRunning ? 'running' : 'stopped'}`
//     );
//   }
//
//   async stopAlgo(chatId: number) {
//     try {
//       await taskService.stop();
//       this.sendToAllUsers(`Algorithm stopped successfully.`);
//     } catch (error) {
//       this.sendToAllUsers(
//         `Error stopping algorithm: ${
//           error instanceof Error ? error.message : JSON.stringify(error)
//         }`
//       );
//     }
//   }
//
//   async runAlgo(chatId: number, paramsInput?: string) {
//     try {
//       let currency;
//       let spread;
//       if (paramsInput) {
//         const paramsArray = paramsInput.split(' ');
//         if (paramsArray.length >= 2) {
//           const currency = paramsArray[0];
//           const spread = parseFloat(paramsArray[1]);
//
//           if (isNaN(spread)) {
//             this.sendToAllUsers(
//               `Invalid spread value: ${paramsArray[1]}. Please provide a numeric value.`
//             );
//             return;
//           }
//         } else {
//           this.sendToAllUsers(
//             `Invalid format. Please use the format: /runAlgo <currency> <spread>`
//           );
//           return;
//         }
//       } else {
//         return;
//       }
//
//       if (!currency || !spread) return;
//
//       const params = { currency, spread } as any;
//       await taskService.run(params);
//       this.sendToAllUsers(
//         `Algorithm started successfully with params: ${JSON.stringify(params)}`
//       );
//     } catch (error) {
//       this.sendToAllUsers(
//         `Error starting algorithm: ${
//           error instanceof Error ? error.message : JSON.stringify(error)
//         }`
//       );
//     }
//   }
//
//   sendToAllUsers(message: any) {
//     this.allowedChatIds.forEach((chatId) => {
//       this.bot.sendMessage(chatId, JSON.stringify(message));
//     });
//   }
// }
//
// export const telegramService = new TelegramService();
