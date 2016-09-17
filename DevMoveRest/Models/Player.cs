using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DevMoveRest.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public long Steps { get; set; }
    }
}