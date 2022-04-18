import { FormHelperText, Typography, styled } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { FC, RefCallback } from "react";

const EditorWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "error" && prop !== "required",
})<{
  error: boolean;
  required: boolean;
}>(({ error, required }) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  "& .mce-tinymce": {
    borderColor: error ? "#d32f2f" : "#c4c4c4",
    borderRadius: "4px",
    boxShadow: "none",
    maxWidth: "unset",
    width: "100%",
  },
  "& .mce-toolbar-grp": {
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  },
  "& .mce-edit-area": {
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  "& .defaultSkin table.mceLayout tr.mceLast td": {
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  "& iframe": {
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    width: "calc(100% - 2px) !important",
  },
  "& .MuiFormHelperText-root": {
    color: "#d32f2f",
    marginLeft: "14px",
  },
  "& .MuiTypography-root": {
    color: error ? "#d32f2f" : "unset",
    marginBottom: "5px",
    "&:after": {
      content: required ? '" *"' : '""',
    },
  },
}));

export interface ITinyEditor {
  value?: string | null;
  title: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  reference: RefCallback<any>;
  onChange: (value: string) => void;
}

const TinyEditor: FC<ITinyEditor> = ({
  required,
  title,
  value,
  onChange,
  reference,
  error,
  helperText,
}) => {
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <EditorWrapper error={!!error} required={!!required}>
      <Typography>{title}</Typography>
      <Editor
        apiKey="1ek114ugd7jtxfuy9n3843fsfcvq1k3xvkm5xhjwyk2vk8b6"
        init={{
          height: 200,
          outputFormat: "html",
          branding: false,
          menubar: false,
          statusbar: false,
          deprecation_warnings: false,
          default_link_target: "_blank",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code textcolor",
          ],
          toolbar:
            "undo redo | formatselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code | removeformat | link | image | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        }}
        ref={reference}
        value={value || ""}
        onEditorChange={handleEditorChange}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </EditorWrapper>
  );
};

export default TinyEditor;
