import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { AppIcon } from "../../components/AppIcon";
import { colors } from "../../themes/colors";
import { layout } from "../../themes/dimensions";
import { recipeCategories } from "../../mocks/categories";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Recipe } from "../../types/api";
import { recipeApi } from "../../api/recipeApi";
import { getApiErrorMessage } from "../../config/axios";
import { globalStyles } from "../../styles/globalStyles";
import { AppButton } from "../../components/AppButton";
import { registerModalCallback } from "../../utils/modalCallBack";

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RecipeListScreen() {
  const navigation = useNavigation<any>();

  const scrollRef = useRef<any>(null);
  const paginationRef = useRef<number>(1);
  const hasMoreRef = useRef<boolean>(true);
  const itemsPerpage = useRef<number>(10);
  const filtersAnimation = useRef(new Animated.Value(1)).current;
  const filtersVisibleRef = useRef<boolean>(true);
  const lastScrollYRef = useRef<number>(0);

  const [recipeList, setRecipeList] = useState<Recipe[]>([]);

  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(false);
  const [refreshingRecipes, setRefreshingRecipes] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [errorListRecipe, setErrorListRecipe] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [showMoreDetailsRecipe, setShowMoreDetailsRecipe] = useState<number>(0);

  const getRecipes = useCallback(
    async (page = 1, shouldAppend = false, showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshingRecipes(true);
        } else if (shouldAppend) {
          setIsLoadingMore(true);
        } else {
          setLoadingRecipes(true);
        }

        const response = await recipeApi.list({
          search: searchText.trim(),
          id_categoria: selectedCategoryId,
          page,
          limit: itemsPerpage.current,
        });
        setRecipeList((currentRecipes) => (shouldAppend ? [...currentRecipes, ...response.data] : response.data));
        paginationRef.current = response.currentPage;
        hasMoreRef.current = response.hasMore;
      } catch (error) {
        setErrorListRecipe(true);
        navigation.navigate("ModalInfo", {
          title: "Não foi possível carregar receitas",
          message: getApiErrorMessage(error),
        });
      } finally {
        setLoadingRecipes(false);
        setRefreshingRecipes(false);
        setIsLoadingMore(false);
      }
    },
    [searchText, selectedCategoryId],
  );

  useFocusEffect(
    useCallback(() => {
      getRecipes();
    }, [getRecipes]),
  );

  useEffect(() => {
    if (showMoreDetailsRecipe != 0) {
      const recipeIndex = recipeList.findIndex((recipe) => recipe.id === showMoreDetailsRecipe);

      if (recipeIndex < 0) return;

      scrollRef.current?.scrollToIndex({
        index: recipeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [recipeList, showMoreDetailsRecipe]);

  const returnCategoryIcon = (categoryId: number) => {
    const icons: Record<number, string> = {
      1: "cake", // Bolos e tortas doces
      2: "beef", // Carnes
      3: "chicken", // Aves
      4: "fish", // Peixes e frutos do mar
      5: "salad", // Saladas, molhos e acompanhamentos
      6: "soup", // Sopas
      7: "pasta", // Massas
      8: "drink", // Bebidas
      9: "dessert", // Doces e sobremesas
      10: "burger", // Lanches
      11: "plate", // Prato Único
      12: "light", // Light
      13: "healthyFood", // Alimentação Saudável
    };

    return icons[categoryId] ?? "food";
  };

  const loadMoreRecipes = async () => {
    if (isLoadingMore || loadingRecipes || refreshingRecipes || !hasMoreRef.current) return;

    await getRecipes(paginationRef.current + 1, true);
  };

  const toggleRecipeDetails = (recipeId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMoreDetailsRecipe((currentRecipeId) => (currentRecipeId === recipeId ? 0 : recipeId));
  };

  const animateFilters = (visible: boolean) => {
    if (filtersVisibleRef.current === visible) return;

    filtersVisibleRef.current = visible;

    Animated.timing(filtersAnimation, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleRecipeListScroll = (scrollY: number) => {
    const lastScrollY = lastScrollYRef.current;
    const scrollDiff = scrollY - lastScrollY;

    if (scrollY <= 0) {
      animateFilters(true);
    } else if (scrollDiff > 8) {
      animateFilters(false);
    } else if (scrollDiff < -8) {
      animateFilters(true);
    }
    lastScrollYRef.current = scrollY;
  };

  const returnCategoryById = (categoryId: number) => {
    return recipeCategories.find((recipeCategory) => recipeCategory.id === categoryId);
  };

  const removeRecipe = async (recipeId: number) => {
    try {
      await recipeApi.remove(recipeId);
      getRecipes();
    } catch (error) {
      navigation.navigate("ModalInfo", {
        title: "Não foi possível remover a receita",
        message: getApiErrorMessage(error),
      });
    }
  };

  // componentes

  const FooterBar = () => (
    <View style={styles.footerBar}>
      {SearchBar()}
      <RecipeAddButton />
    </View>
  );

  const FilterList = () => (
    <View>
      <FlatList
        data={recipeCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 12, paddingHorizontal: layout.windowWidth / 16 }}
        renderItem={({ item }: any) => {
          const isSelected = selectedCategoryId === item.id;

          return (
            <TouchableOpacity
              onPress={() =>
                item.id == selectedCategoryId ? setSelectedCategoryId(null) : setSelectedCategoryId(item.id)
              }
              style={[
                styles.categoryItem,
                {
                  backgroundColor: isSelected ? item.color : item.lightColor,
                  borderColor: isSelected ? item.color : item.lightColor,
                },
              ]}
              activeOpacity={0.8}
              disabled={loadingRecipes || errorListRecipe}
            >
              <View style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}>
                <AppIcon name={item.icon} color={colors.textPrimary} />
                <Text style={styles.categoryText} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const RecipeList = () => (
    <View style={styles.recipeListContent}>
      <FlatList
        ref={scrollRef}
        data={recipeList}
        contentContainerStyle={[styles.recipeListContentContainer, !recipeList.length && styles.emptyListContent]}
        initialNumToRender={10}
        ListFooterComponent={recipeList.length ? RecipeListFooter : null}
        ListEmptyComponent={RecipeListFeedback}
        onEndReached={loadMoreRecipes}
        onRefresh={() => getRecipes(1, false, true)}
        refreshing={refreshingRecipes}
        onScroll={(event) => handleRecipeListScroll(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(info) => {
          scrollRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const category = returnCategoryById(item.id_categoria);

          return (
            <View style={styles.recipeCard}>
              <TouchableOpacity
                style={styles.recipeCardHeader}
                onPress={() => toggleRecipeDetails(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.recipeIconContainer}>
                  <View style={[styles.recipeIconBackground, { backgroundColor: colors.primaryLight }]}>
                    <AppIcon
                      name={returnCategoryIcon(item.id_categoria)}
                      color={colors.primary}
                      size={layout.windowWidth / 14}
                    />
                  </View>
                </View>
                <View style={styles.recipeInfoContainer}>
                  <Text style={styles.recipeName} numberOfLines={2}>
                    {item.nome}
                  </Text>
                  <Text
                    style={[
                      styles.recipeCategoryText,
                      {
                        color: category?.color ?? colors.primary,
                        backgroundColor: category?.lightColor ?? colors.primaryLight,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {category?.name ?? "Sem categoria"}
                  </Text>
                  <View style={styles.recipeInfoRow}>
                    <View
                      style={[
                        styles.recipeInfoItem,
                        {
                          borderRightWidth: 1,
                          borderColor: colors.border,
                          paddingRight: 8,
                        },
                      ]}
                    >
                      <AppIcon name={"clock"} size={layout.windowWidth / 25} />
                      <Text style={styles.recipeInfoText}>{item.tempo_preparo_minutos} Min</Text>
                    </View>
                    <View style={[styles.recipeInfoItem, { paddingLeft: 8 }]}>
                      <AppIcon name={"userGroup"} size={layout.windowWidth / 25} />
                      <Text style={styles.recipeInfoText}>{item.porcoes} Porções</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.recipeExpandIconContainer}>
                  <AppIcon name={showMoreDetailsRecipe == item.id ? "angleUp" : "angleRight"} />
                </View>
              </TouchableOpacity>

              {showMoreDetailsRecipe == item.id && (
                <View style={styles.recipeDetailsContainer}>
                  <Text style={styles.recipeTitleDetails}>Ingredientes</Text>
                  <View style={styles.recipeIngredientsList}>
                    {item.ingredientes.map((ingredient: string, index: number) => (
                      <View key={`${ingredient}-${index}`} style={styles.recipeIngredientsItem}>
                        <AppIcon name="dot" size={layout.windowWidth / 60} />
                        <Text style={styles.recipeIngredientsText}>{`${ingredient}`}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.recipeInstructionsContainer}>
                    <Text style={styles.recipeTitleDetails}>Modo de Preparo</Text>
                    <Text style={styles.recipeInstructionsText}>{item.modo_preparo}</Text>
                  </View>
                </View>
              )}

              <View style={styles.recipeButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.recipeButton,
                    {
                      borderRightWidth: 1,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => navigation.navigate("RecipeForm", { recipe: item })}
                  activeOpacity={0.8}
                  hitSlop={{ top: 10, bottom: 10 }}
                >
                  <AppIcon name={"edit"} color={colors.primary} />
                  <Text style={styles.recipeEditButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.recipeButton}
                  onPress={() =>
                    navigation.navigate("ModalInfo", {
                      title: "Excluir Receita",
                      message: "Deseja realmente excluir esta receita?",
                      btn1Txt: "Não",
                      btn2Txt: "Sim",
                      btn2CallBackId: registerModalCallback(() => removeRecipe(item.id)),
                    })
                  }
                  activeOpacity={0.8}
                  hitSlop={{ top: 10, bottom: 10 }}
                >
                  <AppIcon name={"delete"} color={colors.danger} />
                  <Text style={styles.recipeDeleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );

  const SearchBar = () => (
    <View style={styles.searchBar}>
      <View style={styles.searchBarIcon}>
        <AppIcon name="search" />
      </View>
      <TextInput
        style={styles.searchBarInput}
        value={searchText}
        onChangeText={(value): any => setSearchText(value)}
        placeholder={"Pesquisar Receita"}
        placeholderTextColor={colors.placeHolderTextColor}
        maxLength={100}
        numberOfLines={1}
      />
      {!!searchText.trim() && (
        <TouchableOpacity
          style={styles.clearTextIcon}
          onPress={() => setSearchText("")}
          hitSlop={15}
          activeOpacity={0.8}
        >
          <AppIcon name="cancel" />
        </TouchableOpacity>
      )}
    </View>
  );

  const RecipeAddButton = () => (
    <View style={styles.recipeAddButtonContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("RecipeForm")}
        activeOpacity={0.8}
        disabled={loadingRecipes}
        style={styles.recipeAddButton}
      >
        <AppIcon name="plus" size={layout.windowWidth / 20} color={colors.background} />
      </TouchableOpacity>
    </View>
  );

  const RecipeListFeedback = () => {
    if (loadingRecipes) return <LoadingListRecipeFeedback />;
    if (errorListRecipe) return <ErrorListRecipeFeedback />;
    return <EmptyListRecipeFeedback />;
  };

  const LoadingListRecipeFeedback = () => (
    <View style={globalStyles.centerContent}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const ErrorListRecipeFeedback = () => (
    <View style={[globalStyles.centerContent, { gap: 15 }]}>
      <Text style={styles.emptyListTitle}>Não foi possível carregar as receitas</Text>
      <AppButton title="Tentar Novamente" onPress={() => getRecipes()} textStyle={{ color: colors.background }} />
    </View>
  );

  const EmptyListRecipeFeedback = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListTitle}>Nenhuma receita Cadastrada</Text>
      <Text style={styles.emptyListText}>Para adicionar uma nova receita toque no botão abaixo</Text>
    </View>
  );

  const RecipeListFooter = () => {
    if (!isLoadingMore) return <View style={styles.recipeListFooter} />;

    return (
      <Fragment>
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <View style={styles.recipeListFooter} />
      </Fragment>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.recipeListWrapper}>
        {RecipeList()}
        <Animated.View
          style={[
            styles.filtersContainer,
            {
              opacity: filtersAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, errorListRecipe ? 0.5 : 1],
              }),
              transform: [
                {
                  translateY: filtersAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layout.windowWidth, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {FilterList()}
          {FooterBar()}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  text: {
    color: "#555555",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: layout.windowWidth / 16,
    marginTop: layout.windowWidth / 20,
  },

  searchBar: {
    marginLeft: layout.windowWidth / 16,
    marginVertical: layout.windowWidth / 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    width: "70%",
  },
  searchBarIcon: {
    alignItems: "center",
    width: "15%",
  },
  clearTextIcon: {
    alignItems: "center",
    width: "15%",
  },
  searchBarInput: {
    color: colors.textPrimary,
    fontSize: 14,
    width: "70%",
  },

  categoryItem: {
    width: layout.windowWidth / 3.7,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  categoryText: {
    color: colors.textPrimary,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: 5,
  },

  recipeListContent: {
    flex: 1,
    marginHorizontal: layout.windowWidth / 16,
  },
  recipeListWrapper: {
    flex: 1,
  },
  recipeListContentContainer: {
    flexGrow: 1,
    paddingBottom: layout.windowWidth / 2.9,
  },
  filtersContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingVertical: 10,
  },
  recipeCard: {
    marginTop: layout.windowWidth / 20,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    gap: 5,
    backgroundColor: colors.background,
    elevation: 1,
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeIconContainer: {
    width: "25%",
    alignItems: "center",
  },
  recipeIconBackground: {
    borderRadius: 30,
    padding: 15,
    backgroundColor: colors.primaryLight,
  },
  recipeInfoContainer: {
    width: "65%",
    alignItems: "baseline",
    padding: 10,
    gap: 5,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  recipeCategoryText: {
    fontSize: 14,
    fontWeight: "400",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  recipeInfoRow: {
    flexDirection: "row",
  },
  recipeInfoItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  recipeInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recipeExpandIconContainer: {
    width: "10%",
    alignItems: "center",
  },
  recipeDetailsContainer: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  recipeTitleDetails: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    paddingBottom: 10,
  },
  recipeIngredientsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  recipeIngredientsItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    gap: 5,
  },
  recipeIngredientsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  recipeInstructionsContainer: {
    padding: 10,
  },
  recipeInstructionsText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  recipeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  recipeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginTop: 10,
    gap: 10,
  },
  recipeEditButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
  },
  recipeDeleteButtonText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: "bold",
  },
  recipeAddButtonContainer: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },

  recipeAddButton: {
    padding: layout.windowWidth / 20,
    backgroundColor: colors.primary,
    borderRadius: 100,
  },

  emptyListContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  emptyListText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  footerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  recipeListFooter: {
    height: layout.windowWidth / 1.5,
    width: "100%",
  },
  loadingFooter: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
});
