import { useState} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  useToast
} from '@chakra-ui/react'
type NavigationProps = {
  addTimer: (timerName:string)=>void
}

const Navigation = ({addTimer}:NavigationProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState('')
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const handleClose = () => {
    if(value){
      onClose(); 
      addTimer(value); 
      toast({
        title: 'Таймер створено!',
        description: `Таймер ${value} успішно створено!`,
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setValue('');
      return
    }
    toast({
      title: 'Помилка!',
      description: `Будь-ласка введіть назву таймера!`,
      position: 'top-right',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });

  }

  const toast = useToast();
  return (
    <nav className="nav">
        <div className="nav__wrapper">
            Navigation
            <button onClick={onOpen}>add timer</button>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
              <ModalOverlay />
              <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input 
                placeholder="Введіть назву таймера"
                value={value}
                onChange={handleChange}
                 />

              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleClose}>
                  Add
                </Button>
              </ModalFooter>
            </ModalContent>
            </Modal>
        </div>
    </nav>
  )
}

export default Navigation