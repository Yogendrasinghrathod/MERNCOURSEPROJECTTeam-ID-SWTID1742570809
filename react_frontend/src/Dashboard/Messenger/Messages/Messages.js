import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/system";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message";
import DateSeparator from "./DateSeparator";

const MainContainer = styled("div")({
  height: "calc(100% - 60px)",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const convertDateToHumanReadable = (date, format) => {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
  };

  return format.replace(/mm|dd|yy|yyyy/gi, (matched) => map[matched]);
};

const Messages = () => {
  const chosenChatDetails = useSelector(state => state.chat.chosenChatDetails);
  const messages = useSelector(state => state.chat.messages);
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MainContainer ref={containerRef}>
      <MessagesHeader name={chosenChatDetails?.name} />
      {messages.length === 0 ? (
        <div>No messages yet</div> // Message when there are no messages
      ) : (
        messages.map((message, index) => {
          const sameAuthor =
            index > 0 &&
            messages[index].author._id === messages[index - 1].author._id;

          const sameDay =
            index > 0 &&
            convertDateToHumanReadable(new Date(message.date), "dd/mm/yy") ===
              convertDateToHumanReadable(
                new Date(messages[index - 1].date),
                "dd/mm/yy"
              );

          return (
            <div key={message._id} style={{ width: "100%" }}>
              {(!sameDay || index === 0) && (
                <DateSeparator
                  date={convertDateToHumanReadable(
                    new Date(message.date),
                    "dd/mm/yy"
                  )}
                />
              )}
              <Message
                content={message.content}
                username={message.author.username}
                sameAuthor={sameAuthor}
                date={convertDateToHumanReadable(
                  new Date(message.date),
                  "dd/mm/yy"
                )}
                sameDay={sameDay}
              />
            </div>
          );
        })
      )}
    </MainContainer>
  );
};

export default Messages;
