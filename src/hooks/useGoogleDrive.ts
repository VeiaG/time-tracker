import { useEffect, useState } from "react";
export type GetCallback<T> = (value: T) => void;

const fetchUserFiles = async (
  access_token: string,
  getCallback: GetCallback<UserFiles>
) => {
  return fetch(
    "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  ).then(async (response) => {
    if (!response.ok) {
      console.error("Unauthorized with token: " + access_token);
      return;
    }
    const userFiles = await response.json();
    getCallback(userFiles);
  });
};
export type FileInfo = {
    kind:string,
    mimeType:string,
    id:string,
    name:string,
}
export type UserFiles = {
    kind:string,
    incompleteSearch:boolean,
    files:FileInfo[]
}
type useGoogleDriveType = [
    UserFiles,
    (name:string, content:string) => Promise<void>,
    (fileId: string,callback:GetCallback<string>) => Promise<void>,
    (fileId: string) => Promise<void>,
    (fileId: string, content: string) => Promise<void>,
    () => Promise<void>
    ];
const useGoogleDrive = (access_token: string):useGoogleDriveType => {
  const [userFiles, setUserFiles] = useState<UserFiles >({} as UserFiles);

  useEffect(() => {
    if (!access_token) return;
    fetchUserFiles(access_token, setUserFiles);
  }, [access_token]);
  //refresh files
  const refreshFiles = async () => {
    if (!access_token) return;
    fetchUserFiles(access_token, setUserFiles);
  };
  //create new file
  const createFile = async (name:string, content:string) => {
    if (!access_token) return;

    const fileMetadata = {
      'name': name,
      'parents': ['appDataFolder']
    };

    const responseMetadata = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileMetadata)
    });
  
    const responseData = await responseMetadata.json();
    const fileId = responseData.id;
  
    const responseContent = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: content,
    });
  
    if (!responseContent.ok) {
      console.error('Failed to upload content to file');
    }
  
    // console.log('File added successfully');
    fetchUserFiles(access_token, setUserFiles);
  };
  //open file by id
  const openFile = async (fileId: string,callback:GetCallback<string>) => {
    // console.log('Opening file with id:', fileId);
    if (!access_token) return;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const content = await response.text();
    
    callback(content);
  };
  //delete file by id
  const deleteFile = async (fileId: string) => {
    if (!access_token) return;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.ok) {
      // console.log("File deleted successfully");
      
    } else {
      console.error("Failed to delete file");
    }
    fetchUserFiles(access_token, setUserFiles);
  };
  //edit file by id
  const editFile = async (fileId: string, content: string) => {
    if (!access_token) return;
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: content,
      }
    );

    if (response.ok) {
      // console.log("File edited successfully");
    } else {
      console.error("Failed to edit file");
    }
    fetchUserFiles(access_token, setUserFiles);
  };
  return [userFiles,createFile, openFile, deleteFile, editFile,refreshFiles]
};
export default useGoogleDrive;
