using DevMoveRest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DevMoveRest.Services
{
    public class PlayerService
    {
        private static PlayerService current;

        public static PlayerService Current
        {
            get
            {
                if (current == null)
                    current = new PlayerService();
                return current;
            }
        }

        public List<Player> Players
        {
            get
            {
                return players;
            }
        }

        readonly List<Player> players;
        public PlayerService()
        {
            players = new List<Player>();
        }
    }
}