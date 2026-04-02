# Linux CTF Challenges

A collection of 20 Linux command-line challenges designed to teach and test your Linux skills, from basic file permissions to advanced concepts like symbolic links, compression, and more.

## How to Play

1. **Run the Docker Container:**
   ```bash
   docker run -it ndeepak0x/linux-ctf:v0.1
   ```

2. **Navigate to Challenges:**
   Once inside the container, go to the challenges directory:
   ```bash
   cd /home/ctf/linux_ctf/challenges
   ```

3. **Solve the Challenges:**
   Each numbered directory (01_permissions, 02_dash_file, etc.) contains a challenge. Use Linux commands to find and read the flag files.

4. **Submit Flags:**
   Open `index.html` in your browser and submit the flags you find. The format is `d33p{flag_content}`.

## Challenge List

1. **Permission-based file** - Understanding file permissions
2. **Dash-named file** - Handling files starting with dash (-)
3. **Dash-named folder** - Handling directories starting with dash
4. **Folder with trailing space** - Working with spaces in names
5. **Folder with newline** - Dealing with newlines in directory names
6. **Wildcard folder** - Using wildcards (*)
7. **Execute-only folder** - Navigating execute-only permissions
8. **Symlink trick** - Following symbolic links
9. **Hidden file** - Finding hidden files and directories
10. **Setuid permissions** - Dealing with setuid
11. **Nested symlinks** - Following link chains
12. **Compressed file** - Extracting gzip files
13. **Timestamp manipulation** - Finding files by date
14. **System directories** - Locating files in /tmp
15. **Sticky bit** - Understanding sticky permissions
16. **Hard links** - Working with multiple file references
17. **Extended attributes** - Files with metadata
18. **Sparse files** - Efficient large files
19. **Named pipes** - FIFO pipes
20. **Block device permissions** - Device-like access

## Development

Built by Deepak Nagarkoti
- Twitter: [@ndeepak_](https://twitter.com/ndeepak_)
- LinkedIn: [nagarkotideepak9](https://www.linkedin.com/in/nagarkotideepak9)

## License

This project is open source. Feel free to contribute or modify.