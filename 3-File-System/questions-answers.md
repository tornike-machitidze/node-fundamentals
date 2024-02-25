# 1. how to check if you have permision to read or write from/in a file?

fs.access method allows us to check if we have permission
we should give as a second parameter constants.R_OK for to check reading permission
fs.constants.W_OK parameter to check if we have writing permision

# 2. is it recomended to check file accessibility befoer opn read or write in a file ?

NO. Do not use fs.access() to check for the accessibility of a file before calling fs.open(), fs.readFile(), or fs.writeFile(). Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file is not accessible.

# 3. Which methods/ functions create a file ?

fs.open method opens file if it exists and assigns it a number a descriptor if doesnot exists it creates one and fd === undefined at that time.
appandFile and writeFile creates also one but if you want to just create a file in these last two you should also need to provide data. it should be an empty string.
why we can not create a new file using write and read ?
because write and read takes as a first paramaeter not a path but a fd and so if we do not hava afile created before we can not have fd. so write and read is not an option
1 - fs.writeFile()
2 - fs.appendFile()
3 - fs.open()

# 4. Does fs.open methods creates new file by default ?

NO. it needs to give as a parameter 'w' flag. Which stands for writing.
In general it means open a file for writing but if does not exists create one.
fs.open('path', 'w', () => {})
await fs.open('path', 'w')

# 5. Is 'w' flag only one which allows us to create a new file ?

NO. 'a' flag.
it is give a open methond and opens file for appending. and if does not exists cretaes one.
'a+'

# 6. What 'ax' flag does ?

it is used to create a file for appending.
if file exists if fails.
SO it is a good way to make sure that file does not exists and create a new one.

# 7. Which flags allows open to create a new file and also checks if file does not exists ?

'ax' - append
'wx' - write
both of them create file if file does not exists and throw error if file already exists

# 8. Wht is the good option to create new file using open ?

Because open does not need data parameter .
in writeFile and appendFile example they need data parameter (String, Uint8Array/buffer)

# 9. SO Hole THESE 9 Questions is about mostly how to create a file.

## lets make clear best option to create file is open method

fs.open('filepath', 'w')
fs.open('filepath', 'a')

fs.open('filepath', 'wx') + check if already exists throw error
fs.open('filepath', 'ax') + check if already exists throw error
