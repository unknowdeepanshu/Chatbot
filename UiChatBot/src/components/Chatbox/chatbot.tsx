import TextareaAutosize from "react-textarea-autosize";

import { useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

interface InputGroupCustom {
  handlehandleSubmit: (mess: string) => void;
}

export default function InputGroupCustom({
  handlehandleSubmit,
}: InputGroupCustom) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex w-full items-center pb-10">
      <div className="mx-auto flex w-full justify-center">
        <div id="enter" className="grid w-full max-w-sm gap-6">
          <InputGroup>
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
              placeholder="Autoresize textarea..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                className="ml-auto"
                size="sm"
                variant="default"
                onClick={(e) => handlehandleSubmit(message)}
              >
                Submit
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
