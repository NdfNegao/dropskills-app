// src/data/tool-themes.ts

// Configuration centralisée des couleurs et thèmes pour les outils IA

// Types pour les couleurs et thèmes
export interface ToolTheme {
  primary: string;
  secondary: string;
  accent: string;
  wizard: {
    header: {
      icon: string;
      progress: string;
    };
    steps: {
      active: string;
      completed: string;
      accessible: string;
      disabled: string;
    };
    buttons: {
      primary: string;
      secondary: string;
    };
    highlights: {
      info: string;
      success: string;
      warning: string;
      error: string;
    };
  };
}

// Thèmes par catégorie d'outils
export const TOOL_THEMES: Record<string, ToolTheme> = {
  acquisition: {
    primary: 'from-purple-500 to-indigo-600',
    secondary: 'from-purple-500/20 to-indigo-600/20',
    accent: 'from-purple-400 to-indigo-500',
    wizard: {
      header: {
        icon: 'from-purple-500/20 to-indigo-600/20',
        progress: 'from-purple-500 to-indigo-600'
      },
      steps: {
        active: 'from-purple-500 to-indigo-600',
        completed: 'bg-purple-500',
        accessible: 'bg-[#232323] hover:bg-[#333333]',
        disabled: 'bg-[#1a1a1a]'
      },
      buttons: {
        primary: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
        secondary: 'bg-[#1a1a1a] hover:bg-[#232323]'
      },
      highlights: {
        info: 'from-purple-500/10 to-indigo-600/10 border-purple-500/20',
        success: 'from-green-500/10 to-emerald-600/10 border-green-500/20',
        warning: 'from-orange-500/10 to-amber-600/10 border-orange-500/20',
        error: 'from-red-500/10 to-rose-600/10 border-red-500/20'
      }
    }
  },
  activation: {
    primary: 'from-orange-500 to-red-600',
    secondary: 'from-orange-500/20 to-red-600/20',
    accent: 'from-orange-400 to-red-500',
    wizard: {
      header: {
        icon: 'from-orange-500/20 to-red-600/20',
        progress: 'from-orange-500 to-red-600'
      },
      steps: {
        active: 'from-orange-500 to-red-600',
        completed: 'bg-orange-500',
        accessible: 'bg-[#232323] hover:bg-[#333333]',
        disabled: 'bg-[#1a1a1a]'
      },
      buttons: {
        primary: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
        secondary: 'bg-[#1a1a1a] hover:bg-[#232323]'
      },
      highlights: {
        info: 'from-orange-500/10 to-red-600/10 border-orange-500/20',
        success: 'from-green-500/10 to-emerald-600/10 border-green-500/20',
        warning: 'from-orange-500/10 to-amber-600/10 border-orange-500/20',
        error: 'from-red-500/10 to-rose-600/10 border-red-500/20'
      }
    }
  },
  trafic: {
    primary: 'from-blue-500 to-purple-600',
    secondary: 'from-blue-500/20 to-purple-600/20',
    accent: 'from-blue-400 to-purple-500',
    wizard: {
      header: {
        icon: 'from-blue-500/20 to-purple-600/20',
        progress: 'from-blue-500 to-purple-600'
      },
      steps: {
        active: 'from-blue-500 to-purple-600',
        completed: 'bg-blue-500',
        accessible: 'bg-[#232323] hover:bg-[#333333]',
        disabled: 'bg-[#1a1a1a]'
      },
      buttons: {
        primary: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
        secondary: 'bg-[#1a1a1a] hover:bg-[#232323]'
      },
      highlights: {
        info: 'from-blue-500/10 to-purple-600/10 border-blue-500/20',
        success: 'from-green-500/10 to-emerald-600/10 border-green-500/20',
        warning: 'from-orange-500/10 to-amber-600/10 border-orange-500/20',
        error: 'from-red-500/10 to-rose-600/10 border-red-500/20'
      }
    }
  },
  contenu: {
    primary: 'from-green-500 to-teal-600',
    secondary: 'from-green-500/20 to-teal-600/20',
    accent: 'from-green-400 to-teal-500',
    wizard: {
      header: {
        icon: 'from-green-500/20 to-teal-600/20',
        progress: 'from-green-500 to-teal-600'
      },
      steps: {
        active: 'from-green-500 to-teal-600',
        completed: 'bg-green-500',
        accessible: 'bg-[#232323] hover:bg-[#333333]',
        disabled: 'bg-[#1a1a1a]'
      },
      buttons: {
        primary: 'from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700',
        secondary: 'bg-[#1a1a1a] hover:bg-[#232323]'
      },
      highlights: {
        info: 'from-green-500/10 to-teal-600/10 border-green-500/20',
        success: 'from-green-500/10 to-emerald-600/10 border-green-500/20',
        warning: 'from-orange-500/10 to-amber-600/10 border-orange-500/20',
        error: 'from-red-500/10 to-rose-600/10 border-red-500/20'
      }
    }
  },
  default: {
    primary: 'from-blue-500 to-purple-500',
    secondary: 'from-blue-500/20 to-purple-500/20',
    accent: 'from-blue-400 to-purple-400',
    wizard: {
      header: {
        icon: 'from-blue-500/20 to-purple-500/20',
        progress: 'from-blue-500 to-purple-500'
      },
      steps: {
        active: 'from-blue-500 to-purple-500',
        completed: 'bg-green-500',
        accessible: 'bg-[#232323] hover:bg-[#333333]',
        disabled: 'bg-[#1a1a1a]'
      },
      buttons: {
        primary: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
        secondary: 'bg-[#1a1a1a] hover:bg-[#232323]'
      },
      highlights: {
        info: 'from-blue-500/10 to-purple-500/10 border-blue-500/20',
        success: 'from-green-500/10 to-emerald-600/10 border-green-500/20',
        warning: 'from-orange-500/10 to-amber-600/10 border-orange-500/20',
        error: 'from-red-500/10 to-rose-600/10 border-red-500/20'
      }
    }
  }
};

// Mapping des catégories vers les clés de thèmes
const CATEGORY_THEME_MAP: Record<string, string> = {
  'Acquisition': 'acquisition',
  'Activation': 'activation', 
  'Trafic': 'trafic',
  'Contenu': 'contenu'
};

// Utilitaires

export function getThemeByCategory(category: string): ToolTheme {
  const themeKey = CATEGORY_THEME_MAP[category] || 'default';
  return TOOL_THEMES[themeKey];
}

// Fonction pour mapper les couleurs vers des classes Tailwind statiques
const getStaticColorClasses = (toolColor: string) => {
  const colorMap: Record<string, any> = {
    'purple-500': {
      primary: 'bg-purple-500',
      secondary: 'bg-purple-500/20',
      accent: 'bg-purple-400',
      icon: 'bg-purple-500/20',
      progress: 'bg-purple-500',
      active: 'bg-purple-500',
      completed: 'bg-purple-500',
      primaryHover: 'bg-purple-500 hover:bg-purple-600',
      info: 'bg-purple-500/10 border-purple-500/20'
    },
    'blue-500': {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-500/20',
      accent: 'bg-blue-400',
      icon: 'bg-blue-500/20',
      progress: 'bg-blue-500',
      active: 'bg-blue-500',
      completed: 'bg-blue-500',
      primaryHover: 'bg-blue-500 hover:bg-blue-600',
      info: 'bg-blue-500/10 border-blue-500/20'
    },
    'orange-500': {
      primary: 'bg-orange-500',
      secondary: 'bg-orange-500/20',
      accent: 'bg-orange-400',
      icon: 'bg-orange-500/20',
      progress: 'bg-orange-500',
      active: 'bg-orange-500',
      completed: 'bg-orange-500',
      primaryHover: 'bg-orange-500 hover:bg-orange-600',
      info: 'bg-orange-500/10 border-orange-500/20'
    },
    'green-500': {
      primary: 'bg-green-500',
      secondary: 'bg-green-500/20',
      accent: 'bg-green-400',
      icon: 'bg-green-500/20',
      progress: 'bg-green-500',
      active: 'bg-green-500',
      completed: 'bg-green-500',
      primaryHover: 'bg-green-500 hover:bg-green-600',
      info: 'bg-green-500/10 border-green-500/20'
    },
    'red-500': {
      primary: 'bg-red-500',
      secondary: 'bg-red-500/20',
      accent: 'bg-red-400',
      icon: 'bg-red-500/20',
      progress: 'bg-red-500',
      active: 'bg-red-500',
      completed: 'bg-red-500',
      primaryHover: 'bg-red-500 hover:bg-red-600',
      info: 'bg-red-500/10 border-red-500/20'
    },
    'yellow-500': {
      primary: 'bg-yellow-500',
      secondary: 'bg-yellow-500/20',
      accent: 'bg-yellow-400',
      icon: 'bg-yellow-500/20',
      progress: 'bg-yellow-500',
      active: 'bg-yellow-500',
      completed: 'bg-yellow-500',
      primaryHover: 'bg-yellow-500 hover:bg-yellow-600',
      info: 'bg-yellow-500/10 border-yellow-500/20'
    },
    'pink-500': {
      primary: 'bg-pink-500',
      secondary: 'bg-pink-500/20',
      accent: 'bg-pink-400',
      icon: 'bg-pink-500/20',
      progress: 'bg-pink-500',
      active: 'bg-pink-500',
      completed: 'bg-pink-500',
      primaryHover: 'bg-pink-500 hover:bg-pink-600',
      info: 'bg-pink-500/10 border-pink-500/20'
    },
    'indigo-500': {
      primary: 'bg-indigo-500',
      secondary: 'bg-indigo-500/20',
      accent: 'bg-indigo-400',
      icon: 'bg-indigo-500/20',
      progress: 'bg-indigo-500',
      active: 'bg-indigo-500',
      completed: 'bg-indigo-500',
      primaryHover: 'bg-indigo-500 hover:bg-indigo-600',
      info: 'bg-indigo-500/10 border-indigo-500/20'
    },
    'teal-500': {
      primary: 'bg-teal-500',
      secondary: 'bg-teal-500/20',
      accent: 'bg-teal-400',
      icon: 'bg-teal-500/20',
      progress: 'bg-teal-500',
      active: 'bg-teal-500',
      completed: 'bg-teal-500',
      primaryHover: 'bg-teal-500 hover:bg-teal-600',
      info: 'bg-teal-500/10 border-teal-500/20'
    }
  };
  
  return colorMap[toolColor] || colorMap['purple-500']; // Couleur par défaut
};

// Si tu utilises un module externe pour récupérer la catégorie à partir de l'ID
export function getThemeByToolId(toolId: string): ToolTheme {
  // Import dynamique pour éviter les dépendances circulaires
  const { getToolById } = require('./ai-tools');
  const tool = getToolById(toolId);
  
  if (!tool) return TOOL_THEMES.default;
  
  const colors = getStaticColorClasses(tool.color);
  
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    wizard: {
      header: {
        icon: colors.icon,
        progress: colors.progress
      },
      steps: {
        active: colors.active,
        completed: colors.completed,
        accessible: 'bg-[#232323] hover:bg-[#333333]',
        disabled: 'bg-[#1a1a1a]'
      },
      buttons: {
        primary: colors.primaryHover,
        secondary: 'bg-[#1a1a1a] hover:bg-[#232323]'
      },
      highlights: {
        info: colors.info,
        success: 'bg-green-500/10 border-green-500/20',
        warning: 'bg-orange-500/10 border-orange-500/20',
        error: 'bg-red-500/10 border-red-500/20'
      }
    }
  };
}

// Génère toutes les classes pour le wizard
export function getWizardClasses(toolId: string) {
  const theme = getThemeByToolId(toolId);

  return {
    // Header
    headerIcon: `p-2 ${theme.wizard.header.icon} rounded-lg`,
    progressBar: `${theme.wizard.header.progress} h-2 rounded-full`,

    // Steps
    stepActive: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${theme.wizard.steps.active} text-white shadow-lg`,
    stepCompleted: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${theme.wizard.steps.completed} text-white`,
    stepAccessible: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${theme.wizard.steps.accessible} text-gray-400`,
    stepDisabled: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${theme.wizard.steps.disabled} text-gray-600 cursor-not-allowed`,

    // Buttons
    buttonPrimary: `flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${theme.wizard.buttons.primary} text-white disabled:opacity-50 disabled:cursor-not-allowed`,
    buttonSecondary: `flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${theme.wizard.buttons.secondary} text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`,

    // Highlights
    highlightInfo: `${theme.wizard.highlights.info} rounded-lg p-4`,
    highlightSuccess: `${theme.wizard.highlights.success} rounded-lg p-4`,
    highlightWarning: `${theme.wizard.highlights.warning} rounded-lg p-4`,
    highlightError: `${theme.wizard.highlights.error} rounded-lg p-4`
  };
}

export default TOOL_THEMES;
