const express = require('express');
require('dotenv').config();
const router = express.Router();
const { OpenAI } = require('openai');

// const { OpenAI } = require('@langchain/openai');
const { PromptTemplate } = require("@langchain/core/prompts");
const { BufferMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');
const {spawn} = require('child_process')

const  runPythonScript = async (scriptPath, args = [])=>{
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, ...args]);

        let data = '';
        let error = '';

        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on('data', (chunk) => {
            error += chunk.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}\n${error}`));
            } else {
                resolve(data);
            }
        });
    });
}

try {
    //const pythonTest = await runPythonScript('path/to/your/python_script.py','')
    
} catch (error) {
    
}


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
});

const conversationChain = new ConversationChain({
    llm: openai,
    memory: memory
});


const callOpenAIAPI = async (prompt) => {
    try {

        memory.saveContext
        console.log("!!!!!!!!!!!!!!!!")


        // 메모리에 저장되어있는 질문을 가져옴
        const chatHistory = await memory.loadMemoryVariables({});
        let chatHistoryprompt = chatHistory.chat_history
            .filter(message => message.constructor.name === 'HumanMessage')
            .map(message => message.content)
            .join('\n');

        // chatHistoryprompt가 없으면 prompt를 사용
        if (!chatHistoryprompt) {
            chatHistoryprompt = prompt;
        } else {
            // chatHistoryprompt가 있으면 prompt를 추가
            chatHistoryprompt += `\n${prompt}`;
        }

        console.log(chatHistoryprompt);


        // openAi API를 사용해서 질문을 하였음 
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: chatHistoryprompt }]
        },
            response_format = { 'type': "json_object" }
        );


        // langchain memory에 저장함
        await memory.saveContext(
            [{ role: "user", content: prompt }],
            [{ role: "AI", content: response.choices[0].message }]
        );

        console.log(response.choices[0].message.content)
        return response.choices[0].message;
    } catch (error) {
        console.error('callGpt35() error >>> ', error);
        return null;
    }
};



router.get('/test', (req, res) => {
    res.render('openAI/gpttest', { csrfToken: req.csrfToken() });
});

router.post('/chat', async (req, res) => {
    const prompt = req.body.prompt;
    console.log(req.body.prompt);
    const response = await callOpenAIAPI(prompt);

    if (response) {
        res.json({ 'response': response });
    } else {
        res.status(500).json({ 'error': 'Failed to generate response' });
    }
});

module.exports = router;




// node로 테스트하다가 중단 embedding 부분에서 node의 정보 부족 및 python의 정보 다량

// const documentPDF = require('../utils/langchainRAG/documnetloaders')
// const taxtsplitt = require('../utils/langchainRAG/textsplitters');


// async function test(){

//     try {
//         const dpf = await documentPDF();
//         const output = await taxtsplitt(dpf).then(output => {
//             console.log('Processing complete:');
//         }).catch(error => {
//             console.error('Error:', error);
//         });
    
//     } catch (error) {
//        console.error('Error:', error);
//     }
// }

// test()