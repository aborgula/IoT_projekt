
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import axios, { AxiosResponse } from 'axios';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { Link } from 'react-router-dom';
import {  } from 'react-jwt';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const pages = ['Devices state'];
const settings = ['Profile', 'Logout'];

interface DecodedToken {
    userId: string;
}

function Navbarlogout() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const username = localStorage.getItem('login');

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    
    interface ApiResponse {
        userId: string;
    }
    
    const navigate = useNavigate();


    const handleLogout = async () => {
        
        const token: string = localStorage.getItem('token') ?? '';

        const decodedToken = decodeToken(token) as DecodedToken;
        const id = decodedToken.userId;        
        axios.delete(`http://localhost:3100/api/user/logout/${id}`, {
         
        headers: {
                "Accept": 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': token
            }
        })
        .then((response : AxiosResponse<any, any> ) : void  => {
            if(response.status == 200){
                localStorage.removeItem('token');
                navigate("/");
                window.location.reload();

            }
        })
      
     .catch ((error: Error)=> {
        console.error('Błąd podczas wylogowania:', error);
    })
};

    return (
        <AppBar position="static">
            <Container maxWidth={false} sx={{backgroundColor: 'black'}}>
                <Toolbar disableGutters>

                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            alignItems: 'center',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            transition: 'color 0.2s ease-in-out',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <LanguageIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        IoT Dashboard
                    </Typography>
                    <Typography
                        variant="body1"
                        noWrap
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            color: 'white',
                            fontWeight: 500,
                            transition: 'color 0.3s ease-in-out',
                            '&:hover': {
                                color: '#02b1af',
                                cursor: 'pointer',
                            }
                        }}
                    >
                        {username && `WELCOME, ${username}`}
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
    
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                           
                            </Button>
                        ))}
                    </Box>

                    <div className="logo"></div>

                    <Box sx={{flexGrow: 0}}>
        
                        <Button component={Link} to="/" color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbarlogout;


