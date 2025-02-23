import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTrash, FaRobot } from "react-icons/fa";
import { RiChatSmile2Line, RiLoader4Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { TbSend, TbArrowWaveRightDown } from "react-icons/tb";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await fetch("https://networklast.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Hmm, let me try that again..." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Seems like I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
   
   
    <div className="flex flex-col h-[95vh] w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden font-sans scroll-auto">
      {/* Chat Header */}
      <div className="h-15 w-full"></div>

      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <RiChatSmile2Line className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-100">Smart Office Assistant</h1>
            <p className="text-xs text-emerald-400">Powered by AI</p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2.5 hover:bg-gray-700 rounded-xl transition-all duration-300 group"
        >
          <IoClose className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-850 to-gray-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-75">
            <TbArrowWaveRightDown className="w-16 h-16 text-gray-600 mb-4 animate-pulse" />
            <p className="text-gray-500 text-lg">How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl relative transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-100"
              } ${
                msg.role === "user" 
                  ? "rounded-br-none hover:bg-emerald-500" 
                  : "rounded-bl-none hover:bg-gray-600"
              }`}
            >
              {msg.role === "assistant" && (
                <FaRobot className="absolute -left-6 top-0 w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <p className="text-gray-100 leading-relaxed">{msg.content}</p>
              <div className={`absolute w-3 h-3 -bottom-[4px] ${
                msg.role === "user" 
                  ? "right-0 bg-emerald-600" 
                  : "left-0 bg-gray-700"
              }`}></div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-4 rounded-2xl rounded-bl-none animate-pulse">
              <div className="flex items-center space-x-2">
                <RiLoader4Fill className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-gray-400">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Smart Assistant..."
            className="flex-1 p-3.5 bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-gray-600 placeholder-gray-400 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="p-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            {isLoading ? (
              <RiLoader4Fill className="w-5 h-5 animate-spin" />
            ) : (
              <TbSend className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Smart Assistant may make mistakes. Verify important information.
        </p>
      </div>
    </div>
    
    
  
  );
};

export default Chat;